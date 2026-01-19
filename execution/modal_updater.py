import modal
import json
import os
import datetime
import subprocess

# Define Modal Image with dependencies
image = (
    modal.Image.debian_slim().apt_install("git").pip_install("requests", "apify-client")
)

app = modal.App("candidatos-monitor")

secrets = modal.Secret.from_name("candidatos-secrets")

REPO_URL = "github.com/jhonsu01/RedesCandidatosPresidenciaCol2026.git"
DATA_FILENAME = "data.json"


def get_apify_client():
    from apify_client import ApifyClient

    token = os.environ.get("APIFY_API_TOKEN")
    if not token:
        print("WARNING: APIFY_API_TOKEN not found.")
        return None
    return ApifyClient(token)


def scrape_instagram(client, handle):
    if not client or not handle:
        return 0, None
    try:
        run_input = {"usernames": [handle]}
        run = client.actor("apify/instagram-profile-scraper").call(run_input=run_input)
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            return item.get("followersCount", 0), item.get("profilePicUrl")
    except Exception as e:
        print(f"Error Instagram ({handle}): {e}")
    return 0, None


def scrape_tiktok(client, handle):
    if not client or not handle:
        return 0, None
    try:
        run_input = {"profiles": [handle], "resultsPerPage": 1}
        run = client.actor("clockworks/tiktok-profile-scraper").call(
            run_input=run_input
        )
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            stats = item.get("stats", {})
            # TikTok usually provides avatarThumb or avatarMedium
            photo = item.get("authorMeta", {}).get("avatar") or item.get("avatarThumb")
            return stats.get("followerCount", 0), photo
    except Exception as e:
        print(f"Error TikTok ({handle}): {e}")
    return 0, None


def scrape_facebook(client, handle):
    if not client or not handle:
        return 0, None
    try:
        url = f"https://www.facebook.com/{handle}"
        run_input = {"startUrls": [{"url": url}]}
        run = client.actor("apify/facebook-pages-scraper").call(run_input=run_input)
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            # Facebook actor usually returns profilePic
            return item.get("likes", 0), item.get("profilePic")
    except Exception as e:
        print(f"Error Facebook ({handle}): {e}")
    return 0, None


@app.function(
    image=image, secrets=[secrets], schedule=modal.Period(days=1), timeout=1200
)
def update_candidates_data():
    print(f"--- Iniciando Actualización: {datetime.datetime.now()} ---")

    gh_token = os.environ.get("GITHUB_TOKEN")

    if not gh_token:
        print("ERROR: GITHUB_TOKEN faltante en secretos.")
        return

    if os.path.exists("repo"):
        subprocess.run(["rm", "-rf", "repo"])

    subprocess.run(["git", "clone", f"https://{gh_token}@{REPO_URL}", "repo"])
    os.chdir("repo")

    if not os.path.exists(DATA_FILENAME):
        print(f"ERROR: {DATA_FILENAME} no encontrado.")
        return

    with open(DATA_FILENAME, "r", encoding="utf-8") as f:
        candidates = json.load(f)

    client = get_apify_client()
    updated_candidates = []

    for c in candidates:
        name = c["name"]
        socials = c["socials"]
        print(f"Procesando: {name}...")

        prev_total = c["followers"].get("total", 0)

        # Guardaremos el primer URL de foto válido que encontremos
        new_photo = None

        # Instagram
        ig_count, ig_photo = (
            scrape_instagram(client, socials.get("instagram"))
            if socials.get("instagram")
            else (0, None)
        )
        if ig_count == 0:
            ig_count = c["followers"].get("instagram", 0)
        if ig_photo:
            new_photo = ig_photo

        # TikTok
        tk_count, tk_photo = (
            scrape_tiktok(client, socials.get("tiktok"))
            if socials.get("tiktok")
            else (0, None)
        )
        if tk_count == 0:
            tk_count = c["followers"].get("tiktok", 0)
        if tk_photo and not new_photo:
            new_photo = tk_photo

        # Facebook
        fb_count, fb_photo = (
            scrape_facebook(client, socials.get("facebook"))
            if socials.get("facebook")
            else (0, None)
        )
        if fb_count == 0:
            fb_count = c["followers"].get("facebook", 0)
        if fb_photo and not new_photo:
            new_photo = fb_photo

        new_total = ig_count + tk_count + fb_count
        diff = new_total - prev_total

        # Actualizar datos
        c["followers"] = {
            "instagram": ig_count,
            "tiktok": tk_count,
            "facebook": fb_count,
            "total": new_total,
        }

        # Actualizar foto si se encontró una nueva
        if new_photo:
            c["photo"] = new_photo

        c["last_update"] = datetime.datetime.now().strftime("%Y-%m-%d")
        c["trend"] = "up" if diff > 0 else ("down" if diff < 0 else "equal")
        c["last_days_growth"] = abs(diff)

        updated_candidates.append(c)

    with open(DATA_FILENAME, "w", encoding="utf-8") as f:
        json.dump(updated_candidates, f, indent=2, ensure_ascii=False)

    print("Enviando cambios a GitHub...")
    subprocess.run(["git", "config", "user.name", "Candidatos Bot"])
    subprocess.run(["git", "config", "user.email", "bot@candidatos2024.com"])
    subprocess.run(["git", "add", DATA_FILENAME])
    subprocess.run(
        [
            "git",
            "commit",
            "-m",
            f"chore: auto-update socials and photos {datetime.datetime.now()}",
        ]
    )
    subprocess.run(["git", "push", "origin", "main"])


if __name__ == "__main__":
    pass
