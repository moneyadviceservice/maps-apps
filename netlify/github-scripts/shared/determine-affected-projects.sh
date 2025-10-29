#!/usr/bin/env bash
set -eu

# Navigate to the build sources directory
cd "${GITHUB_WORKSPACE:-.}"

# Default RUN_ALL_E2E to false if not set
RUN_ALL_E2E_VALUE="${RUN_ALL_E2E:-false}"

if [[ "$RUN_ALL_E2E_VALUE" == "true" ]]; then
  echo "Running e2e tests for ALL apps."

  all_apps=$(npx nx show projects --type app)
  echo "Found the following apps:"
  echo "$all_apps"

  echo "Formatting output of affected projects..."
  stepoutput=$(echo "$all_apps" | tr '\n' ',')
  stepoutput=${stepoutput%,}

  echo "Setting envstodeploy variable..."
  echo "envstodeploy=$stepoutput" >> $GITHUB_OUTPUT
  echo "envstodeploy is set to: $stepoutput"
  exit 0
fi

# Determine affected projects based on git commits
echo "Fetching base commit from origin/main..."
git fetch origin main --prune

HEAD_COMMIT=$(git rev-parse HEAD)
BASE_COMMIT=$(git rev-parse origin/main)

echo "Base commit: $BASE_COMMIT"
echo "Head commit: $HEAD_COMMIT"

echo "Running npx nx show projects --affected --type app..."
affected=$(npx nx show projects --affected --type app --base="$BASE_COMMIT" --head="$HEAD_COMMIT")

echo "Affected Projects:"
echo "$affected"

if [[ -z "$affected" ]]; then
  echo "No affected projects detected. Exiting."
  stepoutput=""
  echo "envstodeploy=$stepoutput" >> $GITHUB_OUTPUT
  exit 0
fi

echo "Formatting output of affected projects..."
stepoutput=$(echo "$affected" | tr '\n' ',')
stepoutput=${stepoutput%,}

echo "Setting envstodeploy variable..."
echo "envstodeploy=$stepoutput" >> $GITHUB_OUTPUT
echo "envstodeploy is set to: $stepoutput"

echo "Determining affected projects complete."