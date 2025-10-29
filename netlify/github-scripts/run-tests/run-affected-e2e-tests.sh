#!/usr/bin/env bash
set -eu 
      
echo "Retrieving and exporting environment variables from Netlify for app $NETLIFY_SITE_FILTER, site ID $NETLIFY_SITE_ID, using context: $CONTEXT"

if [ "$ENVIRONMENT_VARIABLES" = "Match environment" ] || \
    [ "$ENVIRONMENT_VARIABLES" = "test" ] || \
    [ "$ENVIRONMENT_VARIABLES" = "staging" ]; then
    echo "Fetching branch specific environment variables for $ENVIRONMENT"
    env_vars_json=$(NETLIFY_AUTH_TOKEN=$NETLIFY_AUTH_TOKEN netlify env:list --context=branch:$ENVIRONMENT --json --filter="$NETLIFY_SITE_FILTER")
else
    echo "Fetching context specific environment variables for context $ENVIRONMENT_VARIABLES"
    env_vars_json=$(NETLIFY_AUTH_TOKEN=$NETLIFY_AUTH_TOKEN netlify env:list --context=$ENVIRONMENT_VARIABLES --json --filter="$NETLIFY_SITE_FILTER" )
fi

if [[ -z "$env_vars_json" ]]; then
    echo "Error: Failed to retrieve environment variables."
    exit 1
fi
echo "Parsing and export each environment variable"
for s in $(echo $env_vars_json | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do
    export $s
done

echo "Checking for and setting custom environment variables"
if [ -n "$CUSTOM_ENV_VARS" ]; then
    echo "Exporting custom environment variables"
    IFS=',' read -ra CUSTOM_VARS <<< "$CUSTOM_ENV_VARS"
    for var in "${CUSTOM_VARS[@]}"; do
        if [[ "$var" == *"="* ]]; then
            echo "Exporting custom environment variable: $var"
            export "$var"
        else
            echo "Skipping invalid custom environment variable: $var"
        fi
    done
else
    echo "No custom environment variables provided."
fi

startPort=3000
endPort=3500
portnum=""

IFS=',' read -ra ENVS <<< "$TEST_TO_RUN"
if [ ${#ENVS[@]} -eq 0 ]; then
    echo "No environments to deploy. Exiting."
    exit 0
fi

for env in "${ENVS[@]}"; do
echo "======================================================================="
echo "Running end-to-end tests for $env"
echo "======================================================================="

for port in $(seq $startPort $endPort); do
    lockFile="/tmp/.X${port}-lock"
    if [ -f $lockFile ]; then
        echo "Removing existing lock file: $lockFile"
        rm -f $lockFile
    fi
    if ! nc -z localhost $port; then
        portnum=$port
        startPort=$((portnum + 1))
        break
    fi
done

if [ -z "$portnum" ]; then
    echo "No free port found. Exiting with error."
    exit 1
fi

echo "Starting Xvfb on port: $portnum"
Xvfb :$portnum -screen 0 1280x1024x24 &
XVFB_PID=$!
export DISPLAY=:$portnum

echo "Running E2E tests for environment: $env"

echo "Setting E2E Failed to true by default"
echo "E2E_FAILED=true" >> "$GITHUB_ENV"

testResults=$(npm run test:e2e-ci $env --port='cypress-auto' 2>&1)
status=$?

if [ "$status" -eq 0 ]; then
    echo "E2E tests passed for environment: $env"
    echo "E2E test output: $testResults"
    echo "E2E_FAILED=false" >> "$GITHUB_ENV"

else
    echo "E2E tests failed for environment: $env"
    echo "E2E test output: $testResults"
fi

echo "Terminating Xvfb with PID: $XVFB_PID"
kill $XVFB_PID
done