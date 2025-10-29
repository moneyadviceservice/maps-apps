#!/usr/bin/env bash
set -eu

echo "Determining pipeline identifier..."

# If this is a PR, get the PR number; otherwise, use branch name
if [ "${GITHUB_EVENT_NAME}" == "pull_request" ]; then
    PIPELINE_ID="pr-${GITHUB_REF##*/}"
else
    PIPELINE_ID="${GITHUB_REF_NAME}"
fi

echo "Using Pipeline ID: ${PIPELINE_ID}"

# Export it for subsequent steps
echo "PIPELINE_ID=${PIPELINE_ID}" >> "$GITHUB_ENV"