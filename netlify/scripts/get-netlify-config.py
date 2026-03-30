import os
import json
import requests

NETLIFY_TOKEN = os.getenv("NETLIFY_TOKEN")
SITE_ID = os.getenv("NETLIFY_SITE_ID")

OUTPUT_FILE = "netlify_settings.json"
API_URL = f"https://api.netlify.com/api/v1/sites/{SITE_ID}"

def main():

    if not NETLIFY_TOKEN:
        raise Exception("NETLIFY_TOKEN environment variable is missing")

    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}"
    }

    print("Fetching Netlify site config...")
    response = requests.get(API_URL, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch site: {response.status_code} {response.text}")

    data = response.json()

    build = data.get("build_settings", {})
    plugins = data.get("plugins", [])

    # Remove leading slash from package_path
    package_path = build.get("package_path")
    if package_path:
        package_path = package_path.lstrip("/")

    extracted = {
        "build_settings": {
            "cmd": build.get("cmd"),
            "dir": build.get("dir"),
            "skip_prs": "false",
            "allowed_branches": build.get("allowed_branches"),
            "package_path": package_path,
            "base": build.get("base")
        },
        "plugins": plugins
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(extracted, f, indent=4)

    print(f"Saved extracted Netlify settings to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
