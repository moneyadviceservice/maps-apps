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


def has_unresolved_comments():
    """Check if the PR has any active (unresolved) comment threads."""
    print(f"Checking for unresolved comments on PR #{PR_ID}...")
    try:
        response = requests.get(f"{API_BASE}/threads?{API_VERSION}", headers=headers)
    except Exception as e:
        warn(f"Failed to fetch PR threads: {e}.")
        return True  # Err on the side of caution

    if response.status_code < 200 or response.status_code >= 300:
        warn(f"PR threads request returned HTTP {response.status_code}.")
        return True

    threads = response.json().get("value", [])
    # Status can be integer (1) or string ("active") depending on API version
    active_threads = [t for t in threads if t.get("status") in (1, "active")]

    if active_threads:
        print(f"PR #{PR_ID} has {len(active_threads)} unresolved comment(s). Skipping.")
        return True

    print("No unresolved comments found.")
    return False


def publish_pr():
    """Publish a draft PR by setting isDraft to false."""
    print(f"Publishing draft PR #{PR_ID}...")
    try:
        response = requests.patch(
            f"{API_BASE}?{API_VERSION}",
            headers={**headers, "Content-Type": "application/json"},
            json={"isDraft": False},
        )
    except Exception as e:
        warn(f"Failed to publish PR: {e}. Skipping.")
        return False

    if response.status_code < 200 or response.status_code >= 300:
        warn(f"Publish PR request returned HTTP {response.status_code}. Skipping.")
        return False

    print(f"Successfully published draft PR #{PR_ID}.")
    return True



def main():
    if not SYSTEM_ACCESSTOKEN or not PR_ID:
        warn("Missing SYSTEM_ACCESSTOKEN or PR_ID. Skipping.")
        return

    # 1. GET PR details
    print(f"Fetching PR #{PR_ID} details...")
    try:
        response = requests.get(f"{API_BASE}?{API_VERSION}", headers=headers)
    except Exception as e:
        warn(f"Failed to fetch PR details: {e}. Skipping.")
        return

    if response.status_code < 200 or response.status_code >= 300:
        warn(f"PR details request returned HTTP {response.status_code}. Skipping.")
        return

    pr_data = response.json()
    is_draft = pr_data.get("isDraft", False)
    print(f"PR #{PR_ID} isDraft: {is_draft}")

    # 2. GET PR labels
    print(f"Fetching labels for PR #{PR_ID}...")
    try:
        response = requests.get(f"{API_BASE}/labels?{API_VERSION}", headers=headers)
    except Exception as e:
        warn(f"Failed to fetch PR labels: {e}. Skipping.")
        return

    if response.status_code < 200 or response.status_code >= 300:
        warn(f"PR labels request returned HTTP {response.status_code}. Skipping.")
        return

    labels_data = response.json()
    label_names = [label.get("name", "").lower() for label in labels_data.get("value", [])]
    has_auto_publish = "auto-publish" in label_names

    if not has_auto_publish:
        print("PR does not have 'auto-publish' label. Nothing to do.")
        return

    # 3. Check for unresolved comments
    if has_unresolved_comments():
        return

    # 4. Publish draft if PR is a draft
    if is_draft:
        publish_pr()
    else:
        print("PR is not a draft. Nothing to do.")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        warn(f"Unexpected error: {e}. Skipping auto-publish.")
        sys.exit(0)
