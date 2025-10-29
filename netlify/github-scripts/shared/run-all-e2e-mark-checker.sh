#!/usr/bin/env bash
set -eu 

# --- DEBUG INFO ---
echo "Running e2e-runner.sh"
echo "Build.SourcesDirectory: ${GITHUB_WORKSPACE:-}"
echo "System.PullRequest.SourceBranch: ${GITHUB_HEAD_REF:-}"
echo "System.PullRequest.TargetBranch: ${GITHUB_BASE_REF:-}"

cd "${GITHUB_WORKSPACE:-.}"

# --- Ensure we have full git history ---
git fetch origin "${GITHUB_HEAD_REF}":sourcebranch || {
  echo "Failed to fetch ${GITHUB_HEAD_REF}"
  exit 1
}

# Extract the latest commit message from the PR source branch
COMMIT_MSG=$(git log sourcebranch -1 --pretty=%B)
echo "Latest commit message from PR source branch:"
echo "$COMMIT_MSG"

# Check for e2e marker
if echo "$COMMIT_MSG" | grep -q "\[run-all-e2e\]"; then
  echo "[run-all-e2e] marker found"
  echo "E2E tests will run for all application in the monorepo"
  echo "RUN_ALL_E2E=true" >> $GITHUB_ENV

else
  echo "No [run-all-e2e] marker found."
  echo "RUN_ALL_E2E=false" >> $GITHUB_ENV
fi

