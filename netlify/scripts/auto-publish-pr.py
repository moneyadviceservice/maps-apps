import os
import sys
import requests
from urllib.parse import quote

# Auto-publish a draft PR when it has the "auto-publish" label.
# All errors log ##[warning] and exit 0 — this stage must never fail
# the pipeline since the real work (build/test/analysis) already passed.

SYSTEM_ACCESSTOKEN = os.getenv("SYSTEM_ACCESSTOKEN")
PR_ID = os.getenv("PR_ID")
COLLECTION_URI = os.getenv("SYSTEM_COLLECTIONURI", "")
TEAM_PROJECT = os.getenv("SYSTEM_TEAMPROJECT", "")
REPO_NAME = os.getenv("BUILD_REPOSITORY_NAME", "")

API_BASE = f"{COLLECTION_URI}{quote(TEAM_PROJECT)}/_apis/git/repositories/{REPO_NAME}/pullrequests/{PR_ID}"
API_VERSION = "api-version=7.1-preview.1"

headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {SYSTEM_ACCESSTOKEN}",
}


def warn(msg):
    print(f"##[warning]{msg}")


def main():
    if not SYSTEM_ACCESSTOKEN or not PR_ID:
        warn("Missing SYSTEM_ACCESSTOKEN or PR_ID. Skipping auto-publish.")
        return

    # 1. GET PR details — check if it's a draft
    print(f"Fetching PR #{PR_ID} details...")
    try:
        response = requests.get(f"{API_BASE}?{API_VERSION}", headers=headers)
    except Exception as e:
        warn(f"Failed to fetch PR details: {e}. Skipping auto-publish.")
        return

    if response.status_code < 200 or response.status_code >= 300:
        warn(f"PR details request returned HTTP {response.status_code}. Skipping auto-publish.")
        return

    pr_data = response.json()
    is_draft = pr_data.get("isDraft", False)
    print(f"PR #{PR_ID} isDraft: {is_draft}")

    if not is_draft:
        print("PR is not a draft. Nothing to do.")
        return

    # 2. GET PR labels — check for "auto-publish" label
    print(f"Fetching labels for PR #{PR_ID}...")
    try:
        response = requests.get(f"{API_BASE}/labels?{API_VERSION}", headers=headers)
    except Exception as e:
        warn(f"Failed to fetch PR labels: {e}. Skipping auto-publish.")
        return

    if response.status_code < 200 or response.status_code >= 300:
        warn(f"PR labels request returned HTTP {response.status_code}. Skipping auto-publish.")
        return

    labels_data = response.json()
    label_names = [label.get("name", "").lower() for label in labels_data.get("value", [])]
    has_label = "auto-publish" in label_names

    if not has_label:
        print("PR does not have the 'auto-publish' label. Nothing to do.")
        return

    # 3. PATCH PR — publish by setting isDraft to false
    print(f"Publishing draft PR #{PR_ID}...")
    try:
        response = requests.patch(
            f"{API_BASE}?{API_VERSION}",
            headers={**headers, "Content-Type": "application/json"},
            json={"isDraft": False},
        )
    except Exception as e:
        warn(f"Failed to publish PR: {e}. Skipping.")
        return

    if response.status_code < 200 or response.status_code >= 300:
        warn(f"Publish PR request returned HTTP {response.status_code}. Skipping.")
        return

    print(f"Successfully published draft PR #{PR_ID}.")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        warn(f"Unexpected error: {e}. Skipping auto-publish.")
        sys.exit(0)
