import requests
import os

candidates = {
    "vicky-davila": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Vicky_D%C3%A1vila%2C_precandidata_presidencial.jpg",
    "claudia-lopez": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Claudia_L%C3%B3pez_Hern%C3%A1ndez.jpg",
    "daniel-quintero": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Daniel_Quintero_Calle.jpg",
    "ivan-cepeda": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Iv%C3%A1n_Cepeda_Castro.jpg",
    "maria-fernanda-cabal": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Maria_Fernanda_Cabal_Congreso_de_la_Replublica_de_Colombia.jpg",
    "sergio-fajardo": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Sergio_Fajardo.jpg",
    "juan-daniel-oviedo": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Juan_Daniel_Oviedo.jpg",
    "enrique-penalosa": "https://upload.wikimedia.org/wikipedia/commons/4/42/Enrique_Pe%C3%B1alosa_London.jpg",
    "camilo-romero": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Camilo_Romero_Gobernador.jpg",
}

os.makedirs("assets/candidates", exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

for name, url in candidates.items():
    try:
        print(f"Downloading {name}...")
        response = requests.get(url, headers=headers, stream=True)
        if response.status_code == 200:
            with open(f"assets/candidates/{name}.jpg", "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Success: {name}")
        else:
            print(f"Failed: {name} (Status: {response.status_code})")
    except Exception as e:
        print(f"Error downloading {name}: {e}")
