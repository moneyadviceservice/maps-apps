import os
import json
import requests

NETLIFY_TOKEN = os.getenv("NETLIFY_TOKEN")
SITE_ID = os.getenv("NETLIFY_SITE_ID")

ARTIFACT_DIR = os.getenv("NETLIFY_ARTIFACT_DIR", ".")
INPUT_FILE = os.path.join(ARTIFACT_DIR, "netlify_config/netlify_settings.json")

API_URL = f"https://api.netlify.com/api/v1/sites/{SITE_ID}"

def main():
    print(SITE_ID)
    print(API_URL)

    if not NETLIFY_TOKEN:
        raise Exception("NETLIFY_TOKEN environment variable is missing")

    if not os.path.exists(INPUT_FILE):
        raise Exception(f"{INPUT_FILE} not found. Run GET script first.")

    with open(INPUT_FILE, "r") as f:
        settings = json.load(f)
    
    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "build_settings": settings.get("build_settings", {}),
        "plugins": settings.get("plugins", [])
    }

    print("Updating Netlify site configuration...")
    response = requests.put(API_URL, headers=headers, json=payload)

    if response.status_code not in (200, 201):
        raise Exception(f"Failed to update site: {response.status_code} {response.text}")

    print("Netlify site updated successfully.")
    print(response.json())


if __name__ == "__main__":
    main()
