import os
import re
import sys
import requests
from urllib.parse import quote

# Validate that the PR title follows conventional commit format.
# Posts a comment on the PR and fails the pipeline if the title is invalid.

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


CONVENTIONAL_COMMIT_PATTERN = re.compile(
    r"^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)\((.+)\)!?: .{1,}"
)

VALID_SCOPES = {
    "Apps": [
        "adjustable-income-calculator",
        "baby-cost-calculator",
        "baby-money-timeline",
        "budget-planner",
        "cash-in-chunks",
        "compare-accounts",
        "credit-options",
        "credit-rejection",
        "debt-advice-locator",
        "evidence-hub",
        "fuel-finder",
        "guaranteed-income-estimator",
        "leave-pot-untouched",
        "midlife-mot",
        "money-adviser-network",
        "moneyhelper-booking-forms",
        "moneyhelper-contact-forms",
        "moneyhelper-tools",
        "mortgage-affordability",
        "mortgage-calculator",
        "pensions-dashboard",
        "pensionwise-appointment",
        "pensionwise-triage",
        "redundancy-pay-calculator",
        "retirement-budget-planner",
        "salary-calculator",
        "sandbox",
        "savings-calculator",
        "stamp-duty-calculator",
        "standard-financial-statement",
        "take-whole-pot",
        "tools-index",
        "travel-insurance-directory",
    ],
    "Shared Libraries": [
        "shared-core",
        "shared-csp-policy",
        "shared-entra-id",
        "shared-form",
        "shared-hooks",
        "shared-layouts",
        "shared-mhf",
        "shared-netlify-functions",
        "shared-pension-tools",
        "shared-pwd",
        "shared-redis",
        "shared-tools",
        "shared-ui",
        "shared-utils",
        "shared-vendor",
    ],
    "General": [
        "deps",
        "ci",
        "config",
        "repo",
        "netlify",
    ],
}

ALL_SCOPES = {s for scopes in VALID_SCOPES.values() for s in scopes}


def format_scopes():
    """Format valid scopes as grouped markdown."""
    lines = []
    for category, scopes in VALID_SCOPES.items():
        lines.append(f"**{category}:** {', '.join(f'`{s}`' for s in scopes)}")
    return "\n\n".join(lines)


def post_comment(message):
    """Post a comment thread on the PR."""
    threads_url = f"{API_BASE}/threads?{API_VERSION}"
    body = {
        "comments": [{"parentCommentId": 0, "content": message, "commentType": 1}],
        "status": 1,  # Active
    }
    try:
        response = requests.post(
            threads_url,
            headers={**headers, "Content-Type": "application/json"},
            json=body,
        )
        if response.status_code < 200 or response.status_code >= 300:
            print(f"##[warning]Failed to post PR comment (HTTP {response.status_code}).")
        else:
            print("Posted validation feedback as a PR comment.")
    except Exception as e:
        print(f"##[warning]Failed to post PR comment: {e}")


def main():
    if not SYSTEM_ACCESSTOKEN or not PR_ID:
        print("##[error]Missing SYSTEM_ACCESSTOKEN or PR_ID.")
        sys.exit(1)

    # Fetch PR details
    print(f"Fetching PR #{PR_ID} details...")
    response = requests.get(f"{API_BASE}?{API_VERSION}", headers=headers)

    if response.status_code < 200 or response.status_code >= 300:
        print(f"##[error]PR details request returned HTTP {response.status_code}.")
        sys.exit(1)

    pr_data = response.json()
    title = pr_data.get("title", "")
    print(f"PR title: {title}")

    # Validate against conventional commit pattern
    match = CONVENTIONAL_COMMIT_PATTERN.match(title)

    if match:
        scope = match.group(2)
        if scope in ALL_SCOPES:
            print("PR title follows conventional commit format with a valid scope.")
            return

        # Scope is not in the allowed list
        comment = (
            f"## PR Title Validation Failed — Invalid Scope\n\n"
            f"The scope **`{scope}`** is not recognised:\n\n"
            f"```\n{title}\n```\n\n"
            f"### Valid scopes\n\n"
            f"{format_scopes()}\n"
        )

        post_comment(comment)
        print(f"##[error]PR title has an invalid scope '{scope}': {title}")
        sys.exit(1)

    # Title does not match conventional commit format at all
    comment = (
        f"## PR Title Validation Failed\n\n"
        f"The PR title does not follow [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/#summary) format:\n\n"
        f"```\n{title}\n```\n\n"
        f"### Expected format\n\n"
        f"```\ntype(scope): description\n```\n\n"
        f"A scope is **required**.\n\n"
        f"**Valid types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`\n\n"
        f"### Valid scopes\n\n"
        f"{format_scopes()}\n\n"
        f"### Examples\n\n"
        f"- `feat(pensions-dashboard): add auth check`\n"
        f"- `fix(money-adviser-network): resolve login redirect issue`\n"
        f"- `chore(shared-ui): update button component styles`\n"
        f"- `ci(deps): update dependency versions`\n"
    )

    post_comment(comment)

    print(f"##[error]PR title does not follow conventional commit format: {title}")
    sys.exit(1)


if __name__ == "__main__":
    main()
