#!/usr/bin/env bash
set -eu 

az login --service-principal --username "$AKS_SPN_ID" --password "$AKS_SPN_KEY" --tenant "$TENANT_ID"

STORAGE_ACCOUNT="mapsplaywrightreports"
ACCOUNT_KEY=$(az storage account keys list --account-name "$STORAGE_ACCOUNT" --query "[0].value" --output tsv)
CONTAINER_NAME="$PROJECT_NAME"
REPORT_DIR="apps/e2e/${PROJECT_NAME}-e2e/playwright-report"
BLOB_PREFIX="playwright-reports/${PIPELINE_ID}/"

echo "Uploading Playwright report for ${{ parameters.projectName }}..."

find "$REPORT_DIR" -type f | while read -r file; do
RELATIVE_PATH="${file#$REPORT_DIR/}"
BLOB_NAME="${BLOB_PREFIX}${RELATIVE_PATH}"

echo "Uploading $file to $BLOB_NAME..."
az storage blob upload \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$ACCOUNT_KEY" \
    --container-name "$CONTAINER_NAME" \
    --name "$BLOB_NAME" \
    --file "$file" \
    --content-type "text/html" \
    --overwrite
done

echo "Generating SAS URL for Playwright report..."
SAS_TOKEN=$(az storage blob generate-sas \
--account-name "$STORAGE_ACCOUNT" \
--account-key "$ACCOUNT_KEY" \
--container-name "$CONTAINER_NAME" \
--name "${BLOB_PREFIX}index.html" \
--permissions r \
--expiry $(date -u -d "+7 days" '+%Y-%m-%dT%H:%M:%SZ') \
--output tsv)

BLOB_URL="https://$STORAGE_ACCOUNT.blob.core.windows.net/$CONTAINER_NAME/${BLOB_PREFIX}index.html?$SAS_TOKEN"
echo "Playwright Report URL: $BLOB_URL"

echo "PLAYWRIGHT_REPORT_URL=$BLOB_URL" >> "$GITHUB_ENV"
