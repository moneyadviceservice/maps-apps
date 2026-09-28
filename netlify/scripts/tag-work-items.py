import json
import os
import re
from enum import Enum
from functools import cache
from pathlib import Path

import requests

SYSTEM_ACCESS_TOKEN = os.environ["SYSTEM_ACCESS_TOKEN"]
COMMIT_SHA = os.environ["SOURCE_VERSION"]
ORG_URL = os.environ["SYSTEM_COLLECTION_URI"]
PROJECT = os.environ["SYSTEM_TEAM_PROJECT"]
REPO_ID = os.environ["BUILD_REPOSITORY_ID"]

API_VERSION = "7.1"

IS_VERBOSE = True

AFFECTED_FOLDER_PATH = "/apps/e2e"

QA_GROUP_NAME = "Quality Engineering Initiatives"
DEVELOPER_GROUP_NAME = "maps-apps repository required reviewers"

TAG_MAP = {
    'QA': 'QA Automation',
    'Dev': 'Dev Automation'
}

class ScriptResultTags(Enum):
    GENERIC_FAILURE = "Automatic_Tagging_Failed"
    TAGGING_SUCCESSFUL = "Automatic_Tagging_Successful"


class ErrorMessages(Enum):
    NO_WORK_ITEMS_FOUND = "Could not automatically tag work items as non were attached to the PR"
    COULD_NOT_FIND_AUTHOR = "Could not find commit author in Azure"
    AUTHOR_NOT_IN_ANY_GROUPS = "Commit author is not part of any groups"
    AUTHOR_IS_BOTH_DEV_AND_QA = "Commit author is in both QA and Dev groups"
    UNKNOWN_AUTHOR_ROLE = "Commit author is not part of either QA or Dev group"
    WORK_ITEM_NOT_FOUND = "Tagged work item number could not be found"
    WORK_ITEM_TYPE_NOT_TEST_CASE = "Tagged work item did not have the **WorkItemType** of **Test Case**, all @tests tags should refer to a test case."


def verbose_print(header, data):
    """
    Prints structured data to stdout using Azure Pipelines collapsable groups.
    """
    print(f"##[group]{header}", flush=True)
    print(json.dumps(data, indent=4, sort_keys=True))
    print("##[endgroup]")


def _build_azure_url(api: str, endpoint: str) -> str:
    API_BASES = {
        "git": (f"{ORG_URL}{PROJECT}/_apis/git/", API_VERSION),
        "graph": (f"{ORG_URL.replace('dev.azure.com', 'vssps.dev.azure.com')}_apis/graph/", f"{API_VERSION}-preview.1"),
        "wit": (f"{ORG_URL}{PROJECT}/_apis/wit/", API_VERSION),
        "contributions": (f"{ORG_URL}{PROJECT}/_apis/Contribution/", API_VERSION),
    }
    base_url, version = API_BASES[api]
    url = f"{base_url}{endpoint.lstrip('/')}"
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}api-version={version}"


def azure_request(api, endpoint, method="GET", body=None, print_out=IS_VERBOSE, raise_status=True):
    url = _build_azure_url(api, endpoint)

    headers = {
        "Authorization": f"Bearer {SYSTEM_ACCESS_TOKEN}",
    }

    # Only include JSON header when sending a body
    if method == "PATCH" and body is not None:
        headers["Content-Type"] = "application/json-patch+json"
    elif body is not None:
        headers["Content-Type"] = "application/json"

    resp = requests.request(
        method=method,
        url=url,
        headers=headers,
        json=body if body is not None else None,
    )

    if raise_status:
        resp.raise_for_status()

    data = resp.json()
    status = resp.status_code

    if print_out:
        verbose_print(f"{method} {endpoint}", data)

    return data, status


@cache
def get_pr_and_repo_id():
    # Don't print this, it's like 100k lines.
    data, _ = azure_request("git", "pullrequests?searchCriteria.status=completed", "GET", None, print_out=False)

    current_repo_prs = [
        pr for pr in data.get("value", [])
        if pr.get("repository", {}).get("id") == REPO_ID
    ]

    related_pr = [
        pr for pr in current_repo_prs
        if pr.get("lastMergeCommit", {}).get("commitId") == COMMIT_SHA
    ]

    if len(related_pr) > 1:
        raise Exception(f"No PR found for {COMMIT_SHA} where repo_id is {REPO_ID}")

    if len(related_pr) > 1:
        raise Exception("Multiple matching PRs found; expected exactly one.")

    pr_data = related_pr[0]

    repo_id = pr_data["repository"]["name"]
    pr_id = pr_data.get("pullRequestId")

    return repo_id, pr_id


@cache
def get_commits_within_pr(repo_name, pr_id):
    endpoint = f"repositories/{repo_name}/pullRequests/{pr_id}/commits"
    data, _ = azure_request("git", endpoint, "GET")

    if not data.get("value"):
        raise Exception(f"No commits found for {pr_id} in {repo_name}")

    return data["value"]


@cache
def get_file_changes_from_commit(commit_sha):
    endpoint = (
        f"repositories/{REPO_ID}/diffs/commits"
        f"?baseVersion=main&baseVersionType=branch"
        f"&targetVersion={commit_sha}&targetVersionType=commit"
    )
    data, _ = azure_request("git", endpoint, "GET")

    if not data.get("changes"):
        raise Exception(f"No changes found for {commit_sha} in {REPO_ID}")

    return data.get("changes")


def get_file_path_of_file_changes_in_commits(commits):
    list_of_changes_per_author = []

    for i, commit in enumerate(commits):
        commit_sha = commit.get("commitId")
        commit_author = commit.get("author").get("email")
        changes = get_file_changes_from_commit(commit_sha)

        if IS_VERBOSE:
            verbose_print(f"Commit #{i + 1}", commit)

        file_changes = [
            obj["item"]["path"]
            for obj in changes
            if not obj["item"].get("isFolder", False)
        ]

        changes_per_author = {
            "commit_author": commit_author,
            "file_changes": file_changes,
            "commit_id": commit_sha,
        }

        list_of_changes_per_author.append(changes_per_author)

    return list_of_changes_per_author


@cache
def add_comment_to_pr(pr_id, comment_text):
    payload = {
        "comments": [
            {
                "parentCommentId": 0,
                "content": comment_text,
                "commentType": "system"
            }
        ],
        "status": "closed"
    }

    endpoint = f"repositories/{REPO_ID}/pullRequests/{pr_id}/threads"

    return azure_request("git", endpoint, "POST", payload)


@cache
def add_label_to_pr(pr_id, tag):
    endpoint = f"repositories/{REPO_ID}/pullRequests/{pr_id}/labels"

    payload = {"name": tag}

    return azure_request("git", endpoint, "POST", payload)


@cache
def get_linked_work_item(pr_id):
    endpoint = f"repositories/{REPO_ID}/pullRequests/{pr_id}/workitems"
    work_items_data, _ = azure_request("git", endpoint, "GET")

    list_of_work_items = work_items_data.get("value")

    if not list_of_work_items:
        return [], ErrorMessages.NO_WORK_ITEMS_FOUND.value

    return list_of_work_items, None


@cache
def update_pr_with_message(pr_id, message, label):
    add_comment_to_pr(pr_id, message)
    add_label_to_pr(pr_id, label)


def commit_has_e2e_changes(commit):
    file_changes = commit.get("file_changes") or []

    return any(
        AFFECTED_FOLDER_PATH in change
        for change in file_changes
        if isinstance(change, str)
    )


@cache
def get_user_descriptor(email):
    # Don't print this out, it's around 12k lines long.
    data, _ = azure_request("graph", "users", "GET", print_out=False) or {}

    users = data.get("value") or []

    email_lower = email.lower()

    for user in users:
        mail = (user.get("mailAddress") or "").lower()
        principal = (user.get("principalName") or "").lower()

        if email_lower == mail or email_lower == principal:
            return user.get("descriptor")

    return None


@cache
def get_group_name_by_descriptor(group_descriptor):
    endpoint = f"groups/{group_descriptor}"
    data, _ = azure_request("graph", endpoint, "GET") or {}

    return data.get("displayName")


@cache
def get_user_memberships(user_descriptor):
    endpoint = f"memberships/{user_descriptor}?direction=Up"
    data, _ = azure_request("graph", endpoint, "GET") or {}

    values = data.get("value") or []

    return [
        m["containerDescriptor"]
        for m in values
        if m.get("containerDescriptor")
    ]

@cache
def is_valid_test_case(work_item_id):
    data, status_code = azure_request(
        api="wit",
        endpoint=f"workitems/{work_item_id}",
        method="GET",
        raise_status=False
    ) or {}

    if status_code == 404:
        return (
            f"`@tests {work_item_id}` - "
            f"{ErrorMessages.WORK_ITEM_NOT_FOUND.value}"
        )

    fields = data.get("fields") or {}
    work_item_type = fields.get("System.WorkItemType") or ""

    if work_item_type != "Test Case":
        return (
            f"`@tests {work_item_id}` - "
            f"{ErrorMessages.WORK_ITEM_TYPE_NOT_TEST_CASE.value} "
            f"Actual type was: **{work_item_type}**"
        )


def get_new_test_docs(diff, commit_id):
    new_addition_pattern = re.compile(
        r'^\+(?!\+\+)\s*\*?\s*@tests\s+(\d{1,6})\b'
    )

    removal_pattern = re.compile(
        r'^\-(?!\-\-)\s*\*?\s*@tests\s+(\d{1,6})\b'
    )

    invalid_tests_pattern = re.compile(
        r'^\+(?!\+\+)\s*\*?\s*(@tests\s+(?!\d{1,6}\b).+)$'
    )

    new_test_ids = []
    removed_test_ids = []
    invalid_test_docs = []

    for line in diff.splitlines():
        addition_match = new_addition_pattern.match(line)
        removal_match = removal_pattern.match(line)
        invalid_match = invalid_tests_pattern.match(line)

        if addition_match:
            new_test_ids.append(addition_match.group(1))

        if removal_match:
            removed_test_ids.append(removal_match.group(1))

        if invalid_match:
            invalid_test_docs.append(invalid_match.group(1))

    if IS_VERBOSE:
        verbose_print(f"test documentation review for {commit_id}", {
            "new_test_ids": new_test_ids,
            "removed_test_ids": removed_test_ids,
            "invalid_test_docs": invalid_test_docs
        })

    return new_test_ids, removed_test_ids, invalid_test_docs


@cache
def do_changes_meet_requirements(commit_id):
    diff_path = Path("git-diff.txt")

    if not diff_path.is_file():
      raise RuntimeError(f"Couldnt find git-diff.txt file, this is generated in the pipeline a step before running this python script.")

    diff = diff_path.read_text(encoding="utf-8")

    if IS_VERBOSE:
        verbose_print(f"Getting git diff of {commit_id}", {
            "diff": diff.splitlines()
        })

    new_cases, removed_cases, invalid_docs = get_new_test_docs(
        diff,
        commit_id
    )

    removed_test_cases_set = set(removed_cases)

    # Ignore test references that were added and removed in the same commit.
    all_new_test_case_work_ids = [
        test_id
        for test_id in new_cases
        if test_id not in removed_test_cases_set
    ]

    errors = [
        error
        for work_item_id in all_new_test_case_work_ids
        if (error := is_valid_test_case(work_item_id))
    ]

    for line in invalid_docs:
        errors.append(f'Invalid test doc syntax - `{line}` - It should be `@tests` followed by a test case work id number, example: `@tests 12345 - brief description of the test case`')

    return not errors, errors


@cache
def get_commit_author_role(commit_author):
    user_desc = get_user_descriptor(commit_author)
    if not user_desc:
        return None, ErrorMessages.COULD_NOT_FIND_AUTHOR.value

    group_descriptors = get_user_memberships(user_desc)
    if not group_descriptors:
        return None, ErrorMessages.AUTHOR_NOT_IN_ANY_GROUPS.value

    groups = {
        get_group_name_by_descriptor(g_desc)
        for g_desc in group_descriptors
    }

    # Explicit invalid state: dual membership ambiguity
    if QA_GROUP_NAME in groups and DEVELOPER_GROUP_NAME in groups:
        return None, ErrorMessages.AUTHOR_IS_BOTH_DEV_AND_QA.value

    if QA_GROUP_NAME in groups:
        return "QA", None

    if DEVELOPER_GROUP_NAME in groups:
        return "Dev", None

    return None, ErrorMessages.UNKNOWN_AUTHOR_ROLE.value


def tag_work_items(pr_id, work_items, tags):
    tag_value = ";".join(TAG_MAP[t] for t in tags if t in TAG_MAP)

    tag_payload = [
        {
        "op": "add",
        "path": "/fields/System.Tags",
        "value": tag_value
        }
    ]

    message = (
        "### 🔔 Automatic Tagging System Notification\n"
        "Successfully tagged the following work items:\n"
    )

    for work_item in work_items:
        work_item_id = work_item["id"]
        endpoint = f"workitems/{work_item_id}"
        azure_request("wit", endpoint, "PATCH", tag_payload) or {}
        lines = [
            "### 🔔 Automatic Tagging System Notification",
            "Successfully tagged the following work items:",
        ]

        for work_item in work_items:
            lines.append(
                f"  • #{work_item_id} with `{tag_value.replace(';', ', ')}`"
            )

        message = "\n".join(lines)

    update_pr_with_message(pr_id, message, ScriptResultTags.TAGGING_SUCCESSFUL.value)


def comment_errors_on_pr(pr_id, errors):
    message = (
        "### 🔔 Automatic Tagging System Notification\n"
        "We could not successfully add some tags to work items:\n"
    )

    for error in errors:
        if error["level"] == "pr":
            message = (
                f"{message}\n"
                f"  • {error['error_message']}"
            )

        elif error["level"] == "commit":
            commit_sha = error["commit_sha"]
            message = (
                f"{message}\n"
                f"  • **[{commit_sha[:7]}]** - {error['error_message']}"
            )

    update_pr_with_message(pr_id, message, ScriptResultTags.GENERIC_FAILURE.value)


def get_work_items_tags_and_errors(repo_id, pr_id):
    errors = []
    tags = []

    linked_work_items, wi_error_message = get_linked_work_item(pr_id)
    commits = get_commits_within_pr(repo_id, pr_id)
    file_changes = get_file_path_of_file_changes_in_commits(commits)

    for commit in file_changes:
        if not commit_has_e2e_changes(commit):
            continue

        commit_author = commit.get("commit_author")
        commit_id = commit.get("commit_id")
        author_role, error_message = get_commit_author_role(commit_author)
        if author_role is None:
            errors.append({
                "level": "commit",
                "error_message": error_message,
                "commit_sha": commit_id
            })
        else:
            requirements_met, test_doc_errors = do_changes_meet_requirements(commit_id)
            if requirements_met:
                tags.append(author_role)
            else:
                errors.extend({
                    "level": "commit",
                    "error_message": msg,
                    "commit_sha": commit_id
                } for msg in test_doc_errors)

        # If there was an e2e file change but no work item, exit early and add a warning
        # If we do this too early, there may be PR's tagged with No Work Item errors without an e2e changes
        # If we do his too late, it's just sending unnecessary http requests to azure.
        if not linked_work_items and tags:
          errors.append({
              "level": "pr",
              "error_message": wi_error_message
          })
          return None, None, errors

    unique_tags = list(set(tags))
    return linked_work_items, unique_tags, errors


def main():
    repo_id, pr_id = get_pr_and_repo_id()
    work_items, tags, errors = get_work_items_tags_and_errors(repo_id, pr_id)

    if errors:
        comment_errors_on_pr(pr_id, errors)
    elif tags:
        tag_work_items(pr_id, work_items, tags)

    verbose_print("Debug Information", {
        "pr_id": pr_id,
        "work_items": work_items,
        "tags": tags,
        "errors": errors
    })


if __name__ == "__main__":
    main()
