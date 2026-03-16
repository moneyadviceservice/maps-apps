#!/bin/bash
set -e

ISSUE_KEY="$1"
RELEASE_VERSION="$2"
CUSTOM_COMMENT="$3"
TRIGGERED_BY="$4"
APP_NAME="$5"
BUILD_ID="$6"
NETLIFY_BUILD_URL="https://app.netlify.com/sites/${APP_NAME}/deploys/${BUILD_ID}"

if [[ -z "$ISSUE_KEY" || -z "$RELEASE_VERSION" ]]; then
  echo "Usage: update-jira.sh <ISSUE_KEY> <RELEASE_VERSION> <CUSTOM_COMMENT> <TRIGGERED_BY> <APP_NAME> <BUILD_ID>"
  exit 1
fi

echo "DEBUG: JIRA_API_TOKEN is ${#JIRA_API_TOKEN} characters long"
echo "DEBUG: JIRA_BASE_URL=$JIRA_BASE_URL"
if [[ -z "$JIRA_API_TOKEN" || -z "$JIRA_BASE_URL" ]]; then
  echo "Environment variables JIRA_API_TOKEN, JIRA_BASE_URL must be set."
  exit 1
fi

AUTH_HEADER=$(echo -n "$JIRA_API_TOKEN")

echo "Updating Jira Issue: $ISSUE_KEY with release: $RELEASE_VERSION"

COMMENT_PAYLOAD=$(cat <<EOF
{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "$TRIGGERED_BY completed the production deployment of $APP_NAME" },
          { "type": "hardBreak" },
          { "type": "text", "text": "Release version: $RELEASE_VERSION" },
          { "type": "hardBreak" },
          { "type": "text", "text": "Build ID: " },
          {
            "type": "text",
            "text": "$BUILD_ID",
            "marks": [
              {
                "type": "link",
                "attrs": { "href": "$NETLIFY_BUILD_URL" }
              }
            ]
          },
          { "type": "hardBreak" },
          { "type": "text", "text": "$CUSTOM_COMMENT" }
        ]
      }
    ]
  }
}

EOF
)

COOKIE_HEADER=""
if [[ -n "$ATLASSIAN_XSRF_TOKEN" ]]; then
  COOKIE_HEADER="--header 'Cookie: atlassian.xsrf.token=$ATLASSIAN_XSRF_TOKEN'"
  echo "DEBUG: Using Cookie header for XSRF token."
fi

if [[ -n "$ATLASSIAN_XSRF_TOKEN" ]]; then
  HTTP_CODE=$(curl --location -s -w "%{http_code}" -o /tmp/jira_comment_resp.json \
    -X POST \
    -H "Authorization: Basic $AUTH_HEADER" \
    -H "Content-Type: application/json" \
    -H "Cookie: atlassian.xsrf.token=$ATLASSIAN_XSRF_TOKEN" \
    --data "$COMMENT_PAYLOAD" \
    "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY/comment")
else
  HTTP_CODE=$(curl --location -s -w "%{http_code}" -o /tmp/jira_comment_resp.json \
    -X POST \
    -H "Authorization: Basic $AUTH_HEADER" \
    -H "Content-Type: application/json" \
    --data "$COMMENT_PAYLOAD" \
    "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY/comment")
fi

echo "DEBUG: Jira API response code: $HTTP_CODE"
echo "DEBUG: Jira API response body:"
cat /tmp/jira_comment_resp.json

if [[ "$HTTP_CODE" != "201" ]]; then
  echo "ERROR: Jira API did not return 201 Created. Http code: $HTTP_CODE"
  exit 92
fi

echo "Comment added."

# ----------------------------
# 2) Optional: Update a custom field
# Example: customfield_12345 = release version
# ----------------------------
# Uncomment this block and update the field ID if needed:
#
# UPDATE_PAYLOAD=$(cat <<EOF
# {
#   "fields": {
#     "customfield_12345": "$RELEASE_VERSION"
#   }
# }
# EOF
# )
#
# curl -s -o /dev/null -w "%{http_code}" \
#   -X PUT \
#   -H "Authorization: Basic $AUTH_HEADER" \
#   -H "Content-Type: application/json" \
#   --data "$UPDATE_PAYLOAD" \
#   "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY"
#
# echo "Custom field updated."

echo "Jira update complete."
