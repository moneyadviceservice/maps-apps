import os
import json
import requests
from sites import SITES

NETLIFY_TOKEN = os.getenv("NETLIFY_TOKEN")

def main():
    if not NETLIFY_TOKEN:
        raise Exception("NETLIFY_TOKEN environment variable is missing")

    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}"
    }

    for site_name, site_id in SITES.items():
        site_url = f"https://api.netlify.com/api/v1/sites/{site_id}"

        print("---------------------------------")
        print(f"Working on {site_name}...")
        print("---------------------------------")

        print("Fetching Netlify config...")
        response = requests.get(site_url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch site config: {response.status_code} {response.text}")

        data = response.json()

        account_id = data.get("account_id", "")

        print("Resetting FORCE_BUILD var...")
        update_env_var_url = f"https://api.netlify.com/api/v1/accounts/{account_id}/env/FORCE_BUILD?site_id={site_id}"

        payload = {
            "key": "FORCE_BUILD",
            "is_secret": False,
            "scopes": ["builds", "functions", "runtime", "post_processing"],
            "values": [
                {"context": "all", "value": "false"}
            ]
        }

        response = requests.put(update_env_var_url, headers=headers, json=payload)

        if response.status_code not in (200, 201):
            raise Exception(f"Failed to update env vars: {response.status_code} {response.text}")


if __name__ == "__main__":
    main()