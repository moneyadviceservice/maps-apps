#!/usr/bin/env bash
set -eu 

# --- Input Variables ---
PR_NUMBER="${GITHUB_PR_NUMBER}"
REPO_NAME="${GITHUB_REPOSITORY}"

if [ -n "$PR_NUMBER" ]; then
    COMMENT=$(echo "## 🎭 Playwright report available\n\nPlaywright report for **$TEST_TO_RUN** [available here]($PLAYWRIGHT_REPORT_URL)")

    echo "Posting comment to GitHub Pull Request #$PR_NUMBER in $REPO_NAME"
    echo "Comment content:"
    echo "$COMMENT"

    gh api \
      repos/"$REPO_NAME"/issues/"$PR_NUMBER"/comments \
      -f body="$COMMENT"
else
    echo "No Pull Request ID found, skipping comment posting."
fi