#!/usr/bin/env bash
set -e

#az login --service-principal --username "$AZURE_CLIENT_ID" --password "$AZURE_CLIENT_SECRET" --tenant "$AZURE_TENANT_ID"

KEYVAULT_NAME="netlify-e2e-env-vars"
APP_PREFIX="$NETLIFY_ENV_FILTER"

echo "======================================================================="
echo "DEBUG: APP_PREFIX = '$APP_PREFIX'"
echo "======================================================================="

echo "Retrieving environment variables from Key Vault for app: $APP_PREFIX"

# Get secrets for specific app
SECRET_NAMES=$(az keyvault secret list \
  --vault-name "$KEYVAULT_NAME" \
  --query "[?starts_with(name, '${APP_PREFIX}--')].name" \
  -o tsv)

if [[ -z "$SECRET_NAMES" ]]; then
    echo "Warning: No secrets found in Key Vault $KEYVAULT_NAME"
else
    echo "DEBUG: Total secrets found in Key Vault: $(echo "$SECRET_NAMES" | wc -l)"
fi

for SECRET_NAME in $SECRET_NAMES; do
    echo "Processing secret: $SECRET_NAME"
    
    # Extract the key name after the prefix
    KEY_NAME="${SECRET_NAME#$APP_PREFIX--}"
    
    # Convert to uppercase and replace hyphens with underscores
    ENV_VAR_NAME=$(echo "$KEY_NAME" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
    
    # Get the secret value
    SECRET_VALUE=$(az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "$SECRET_NAME" --query "value" -o tsv)
    
    if [[ -n "$SECRET_VALUE" ]]; then
        echo "Exporting environment variable: $ENV_VAR_NAME"
        export "$ENV_VAR_NAME=$SECRET_VALUE"
    else
        echo "Warning: Secret $SECRET_NAME has no value"
    fi
done

echo "======================================================================="
echo "DEBUG: Matched $MATCHED_SECRETS secrets for '$APP_PREFIX'"
echo "======================================================================="

echo "Environment variables retrieved and exported successfully"

echo "Checking for and setting custom environment variables"
if [ -n "$CUSTOM_ENVIRONMENT_VARIABLES" ]; then
    echo "Exporting custom environment variables"
    IFS=',' read -ra CUSTOM_VARS <<< "$CUSTOM_ENVIRONMENT_VARIABLES"
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

# Check there is an environment to deploy
if [[ -z "$TEST_TO_RUN" ]]; then 
    echo "No environments to deploy. Exiting."
    exit 0
fi

env="$TEST_TO_RUN"
echo "======================================================================="
echo "Running end-to-end tests for $env"
echo "======================================================================="

echo "Running E2E tests for environment: $env"

echo "Setting E2E Failed to true by default"
echo "##vso[task.setvariable variable=E2E_FAILED]true"

status=0
npm run test:e2e-ci $env $TEST_RUNNER --port='cypress-auto' || status=$?

if [ -n "$status" ] && [ "$status" -ne 0 ]; then
    echo "E2E tests failed for environment: $env"
else
    echo "E2E tests passed for environment: $env"
    echo "##vso[task.setvariable variable=E2E_FAILED]false"
fi