#!/bin/bash
set -euo pipefail

ISSUE_KEY="$1"
RELEASE_VERSION="$2"
CUSTOM_COMMENT="$3"
TRIGGERED_BY="$4"
APP_NAME="$5"
BUILD_ID="$6"
NETLIFY_BUILD_URL="https://app.netlify.com/sites/${APP_NAME}/deploys/${BUILD_ID}"

echo "=========================================="
echo "JIRA Update Script - Starting"
echo "=========================================="
echo "Parameters received:"
echo "  ISSUE_KEY: $ISSUE_KEY"
echo "  RELEASE_VERSION: $RELEASE_VERSION"
echo "  CUSTOM_COMMENT: $CUSTOM_COMMENT"
echo "  TRIGGERED_BY: $TRIGGERED_BY"
echo "  APP_NAME: $APP_NAME"
echo "  BUILD_ID: $BUILD_ID"
echo "  NETLIFY_BUILD_URL: $NETLIFY_BUILD_URL"

if [[ -z "$ISSUE_KEY" || -z "$RELEASE_VERSION" ]]; then
  echo "ERROR: Missing required parameters"
  echo "Usage: update-jira.sh <ISSUE_KEY> <RELEASE_VERSION> <CUSTOM_COMMENT> <TRIGGERED_BY> <APP_NAME> <BUILD_ID>"
  exit 1
fi

echo ""
echo "Validating environment variables..."
echo "  JIRA_API_TOKEN length: ${#JIRA_API_TOKEN} characters"
echo "  JIRA_BASE_URL: $JIRA_BASE_URL"

if [[ -z "$JIRA_API_TOKEN" || -z "$JIRA_BASE_URL" ]]; then
  echo "ERROR: Environment variables JIRA_API_TOKEN and JIRA_BASE_URL must be set."
  exit 1
fi

AUTH_HEADER=$(echo -n "$JIRA_API_TOKEN")

echo ""
echo "=========================================="
echo "Preparing JIRA comment for issue: $ISSUE_KEY"
echo "=========================================="

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

echo "Comment payload prepared successfully"
echo ""
echo "Sending request to JIRA API..."
echo "  Endpoint: $JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY/comment"

# Check if optional XSRF token is set (using parameter expansion to avoid unbound variable error)
XSRF_TOKEN="${ATLASSIAN_XSRF_TOKEN:-}"

# Capture both HTTP code and response body
if [[ -n "$XSRF_TOKEN" ]]; then
  echo "  Using XSRF token in cookie header"
  HTTP_CODE=$(curl --location -s -w "%{http_code}" -o /tmp/jira_comment_resp.json \
    -X POST \
    -H "Authorization: Basic $AUTH_HEADER" \
    -H "Content-Type: application/json" \
    -H "Cookie: atlassian.xsrf.token=$XSRF_TOKEN" \
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

echo ""
echo "=========================================="
echo "JIRA API Response"
echo "=========================================="
echo "HTTP Status Code: $HTTP_CODE"
echo ""
echo "Response Body:"
cat /tmp/jira_comment_resp.json || echo "(No response body available)"
echo ""

if [[ "$HTTP_CODE" != "201" ]]; then
  echo ""
  echo "=========================================="
  echo "ERROR: JIRA API Request Failed"
  echo "=========================================="
  echo "Expected HTTP 201 Created, but received: $HTTP_CODE"
  echo ""
  echo "Common error codes:"
  echo "  400 - Bad Request (check payload format)"
  echo "  401 - Unauthorized (check JIRA_API_TOKEN)"
  echo "  403 - Forbidden (check permissions for issue $ISSUE_KEY)"
  echo "  404 - Not Found (check issue key $ISSUE_KEY exists)"
  echo "  500 - Internal Server Error (JIRA server issue)"
  echo ""
  echo "Full error response above. Please review for details."
  echo "=========================================="
  exit 92
fi

echo "✓ Comment added successfully to issue $ISSUE_KEY"

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

echo ""
echo "=========================================="
echo "✓ JIRA Update Completed Successfully"
echo "=========================================="
