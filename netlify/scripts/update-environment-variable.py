import os
import requests
from sites import SITES

NETLIFY_TOKEN = os.getenv("NETLIFY_TOKEN")
VARIABLE_NAME = os.getenv("VARIABLE_NAME")
VARIABLE_VALUE = os.getenv("VARIABLE_VALUE")
APP_NAME = os.getenv("APP_NAME")
ALL_SITES = os.getenv("ALL_SITES", "false")

def get_account_id(site_id):
    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}"
    }

    site_url = f"https://api.netlify.com/api/v1/sites/{site_id}"
    print("Fetching Netlify config...")
    response = requests.get(site_url, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Failed to fetch site config: {response.status_code} {response.text}")
    
    data = response.json()
    account_id = data.get("account_id", "")
    return account_id

def set_env_variable(account_id, site_name, site_id, variable_name, variable_value):
    print(f"Setting {variable_name} var for {site_name} to {variable_value}")
    update_env_var_url = f"https://api.netlify.com/api/v1/accounts/{account_id}/env/{variable_name}?site_id={site_id}"

    payload = {
        "key": variable_name,
        "is_secret": False,
        "scopes": ["builds", "functions", "runtime", "post_processing"],
        "values": [
            {"context": "all", "value": variable_value}
        ]
    }

    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}"
    }

    response = requests.put(update_env_var_url, headers=headers, json=payload)

    if response.status_code not in (200, 201):
        raise Exception(f"Failed to update env vars: {response.status_code} {response.text}")


def main():
    if not NETLIFY_TOKEN:
        raise Exception("NETLIFY_TOKEN environment variable is missing")
    
    if not VARIABLE_NAME:
        raise Exception("VARIABLE_NAME environment variable is missing")
    
    if ALL_SITES.lower() == "true":
        for app_name, site_id in SITES.items():
            print(f"Processing {app_name}...")
            account_id = get_account_id(site_id)
            set_env_variable(account_id, app_name, site_id, VARIABLE_NAME, VARIABLE_VALUE)
    else:
        if not APP_NAME:
            raise Exception("APP_NAME is required when ALL_SITES is not set to 'true'")

        if APP_NAME not in SITES:
            raise Exception(f"App '{APP_NAME}' not found in sites.py")

        site_id = SITES[APP_NAME]
        print(f"Found site: {APP_NAME} -> {site_id}")
        
        account_id = get_account_id(site_id)
        set_env_variable(account_id, APP_NAME, site_id, VARIABLE_NAME, VARIABLE_VALUE)

if __name__ == "__main__":
    main()
