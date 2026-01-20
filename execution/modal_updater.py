import modal
import json
import os
import datetime
import subprocess
import shutil

image = modal.Image.debian_slim().apt_install("git").pip_install("apify-client")

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
        return 0
    try:
        run_input = {"usernames": [handle]}
        run = client.actor("apify/instagram-profile-scraper").call(run_input=run_input)
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            return item.get("followersCount", 0)
    except Exception as e:
        print(f"Error Instagram ({handle}): {e}")
    return 0


def scrape_tiktok(client, handle):
    if not client or not handle:
        return 0
    try:
        run_input = {"profiles": [handle], "resultsPerPage": 1}
        run = client.actor("clockworks/tiktok-profile-scraper").call(run_input=run_input)
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            stats = item.get("stats", {})
            return stats.get("followerCount", 0)
    except Exception as e:
        print(f"Error TikTok ({handle}): {e}")
    return 0


def scrape_facebook(client, handle):
    if not client or not handle:
        return 0
    try:
        url = f"https://www.facebook.com/{handle}"
        run_input = {"startUrls": [{"url": url}]}
        run = client.actor("apify/facebook-pages-scraper").call(run_input=run_input)
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            return item.get("likes", 0)
    except Exception as e:
        print(f"Error Facebook ({handle}): {e}")
    return 0


def scrape_x(client, handle):
    if not client or not handle:
        return 0
    try:
        url = f"https://x.com/{handle}"
        run_input = {"startUrls": [{"url": url}], "tweetsDesired": 1}
        run = client.actor("apidojo/twitter-profile-scraper").call(run_input=run_input)
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            author = item.get("author", {})
            return author.get("followers", 0) or author.get("followersCount", 0) or item.get("followers", 0)
    except Exception as e:
        print(f"Error X/Twitter ({handle}): {e}")
    return 0


@app.function(
    image=image, secrets=[secrets], schedule=modal.Period(weeks=1), timeout=3600
)
def update_candidates_data():
    print(f"--- Iniciando Actualización: {datetime.datetime.now()} ---")

    gh_token = os.environ.get("GITHUB_TOKEN")
    if not gh_token:
        print("ERROR: GITHUB_TOKEN faltante en secretos.")
        return

    if os.path.exists("repo"):
        shutil.rmtree("repo")

    subprocess.run(["git", "clone", f"https://{gh_token}@{REPO_URL}", "repo"], check=True)
    os.chdir("repo")

    if not os.path.exists(DATA_FILENAME):
        print(f"ERROR: {DATA_FILENAME} no encontrado.")
        return

    with open(DATA_FILENAME, "r", encoding="utf-8") as f:
        candidates = json.load(f)

    client = get_apify_client()

    for c in candidates:
        name = c["name"]
        socials = c["socials"]
        print(f"Procesando: {name}...")

        prev_total = c["followers"].get("total", 0)

        ig_count = scrape_instagram(client, socials.get("instagram")) or c["followers"].get("instagram", 0)
        tk_count = scrape_tiktok(client, socials.get("tiktok")) or c["followers"].get("tiktok", 0)
        fb_count = scrape_facebook(client, socials.get("facebook")) or c["followers"].get("facebook", 0)
        x_count = scrape_x(client, socials.get("x")) or c["followers"].get("x", 0)
        new_total = ig_count + tk_count + fb_count + x_count
        diff = new_total - prev_total

        c["followers"] = {
            "instagram": ig_count,
            "tiktok": tk_count,
            "facebook": fb_count,
            "x": x_count,
            "total": new_total,
        }
        c["last_update"] = datetime.datetime.now().strftime("%Y-%m-%d")
        c["trend"] = "up" if diff > 0 else ("down" if diff < 0 else "equal")
        c["last_days_growth"] = abs(diff)

    with open(DATA_FILENAME, "w", encoding="utf-8") as f:
        json.dump(candidates, f, indent=2, ensure_ascii=False)

    print("Enviando cambios a GitHub...")
    subprocess.run(["git", "config", "user.name", "Candidatos Bot"], check=True)
    subprocess.run(["git", "config", "user.email", "bot@candidatos2026.com"], check=True)
    subprocess.run(["git", "add", DATA_FILENAME], check=True)

    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        capture_output=True
    )

    if result.returncode != 0:
        subprocess.run([
            "git", "commit", "-m",
            f"chore: auto-update followers {datetime.datetime.now().strftime('%Y-%m-%d')}"
        ], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("Cambios enviados exitosamente.")
    else:
        print("No hay cambios para enviar.")
