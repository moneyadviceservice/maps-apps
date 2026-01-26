#!/usr/bin/env bash

# --- DEBUG INFO ---
echo "Running code-analysis-runner.sh"
echo "Build.SourcesDirectory: ${BUILD_SOURCESDIRECTORY:-}"
echo "System.PullRequest.SourceBranch: ${SYSTEM_PULLREQUEST_SOURCEBRANCH:-}"
echo "System.PullRequest.TargetBranch: ${SYSTEM_PULLREQUEST_TARGETBRANCH:-}"

cd "${BUILD_SOURCESDIRECTORY:-.}"

# --- Ensure we have full git history ---
git fetch origin "${SYSTEM_PULLREQUEST_SOURCEBRANCH}":sourcebranch || {
  echo "Failed to fetch ${SYSTEM_PULLREQUEST_SOURCEBRANCH}"
  exit 1
}

# Extract the latest commit message from the PR source branch
COMMIT_MSG=$(git log sourcebranch -1 --pretty=%B)
echo "Latest commit message from PR source branch:"
echo "$COMMIT_MSG"

# Check for SonarCloud marker
if echo "$COMMIT_MSG" | grep -q "\[run-all-sonar\]"; then
  echo "[run-all-sonar] marker found"
  echo "SonarCloud analysis will run for all applications in the monorepo"
  echo "##vso[task.setvariable variable=RUN_ALL_SONAR]true"
else
  echo "No [run-all-sonar] marker found"
  echo "##vso[task.setvariable variable=RUN_ALL_SONAR]false"
fi

