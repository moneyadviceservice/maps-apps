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
        deploy_preview_url = f"https://api.netlify.com/api/v1/sites/{site_id}/deploys" 
        site_url = f"https://api.netlify.com/api/v1/sites/{site_id}"

        print("---------------------------------")
        print(f"Working on {site_name}...")
        print("---------------------------------")

        print("Fetching Netlify branches and config...")
        response = requests.get(site_url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch site config: {response.status_code} {response.text}")

        data = response.json()

        allowed_branches = data.get("build_settings", {}).get("allowed_branches", [])
        account_id = data.get("account_id", "")

        print("Resetting FORCE_BUILD var...")
        update_env_var_url = f"https://api.netlify.com/api/v1/accounts/{account_id}/env/FORCE_BUILD?site_id={site_id}"

        payload = {
            "key": "FORCE_BUILD",
            "is_secret": False,
            "scopes": ["builds", "functions", "runtime", "post_processing"],
            "values": [
                {"context": "all", "value": "true"}
            ]
        }

        response = requests.put(update_env_var_url, headers=headers, json=payload)

        if response.status_code not in (200, 201):
            raise Exception(f"Failed to update env vars: {response.status_code} {response.text}")

        print("Fetching Most Recent Deploy Preview...")
        response = requests.get(deploy_preview_url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch deploys: {response.status_code} {response.text}")

        data = response.json()

        first_deploy_preview_id = next((item.get("id") for item in data if item.get("context") == "deploy-preview"), None)

        print("Triggerring deploy for most recent deploy preview...")
        retry_deploy_url = f"https://app.netlify.com/access-control/bb-api/api/v1/deploys/{first_deploy_preview_id}/retry"
        payload = {'clear_cache': True}
        
        response = requests.post(retry_deploy_url, headers=headers, json=payload)

        if response.status_code not in (200, 201):
            raise Exception(f"Failed to retry deploy preview deployment: {response.status_code} {response.text}")
        
        print("Triggerring build for branches...")
        for branch in allowed_branches:
            payload = {'branch': branch, 'clear_cache': True}
            build_branch_url = f"https://api.netlify.com/api/v1/sites/{site_id}/builds"
            response = requests.post(build_branch_url, headers=headers, json=payload)
            
            if response.status_code not in (200, 201):
                raise Exception(f"Failed to fetch deploys: {response.status_code} {response.text}")


if __name__ == "__main__":
    main()