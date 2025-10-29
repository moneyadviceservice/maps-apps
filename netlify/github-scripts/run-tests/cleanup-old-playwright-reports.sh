#!/usr/bin/env bash
set -eu 

az login --service-principal --username "$AKS_SPN_ID" --password "$AKS_SPN_KEY" --tenant "$TENANT_ID"
STORAGE_ACCOUNT="mapsplaywrightreports"
CONTAINER_NAME="$PROJECT_NAME"
ACCOUNT_KEY=$(az storage account keys list --account-name "$STORAGE_ACCOUNT" --query "[0].value" --output tsv)
EXPIRY_DATE=$(date -u -d '14 days ago' '+%Y-%m-%dT%H:%M:%SZ')

echo "Cleaning up Playwright reports older than 14 days in $CONTAINER_NAME..."

OLD_BLOBS=$(az storage blob list \
--account-name "$STORAGE_ACCOUNT" \
--account-key "$ACCOUNT_KEY" \
--container-name "$CONTAINER_NAME" \
--query "[?properties.lastModified < '$EXPIRY_DATE'].name" \
--output tsv)

for blob in $OLD_BLOBS; do
    echo "Deleting old report: $blob"
    az storage blob delete \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$ACCOUNT_KEY" \
    --container-name "$CONTAINER_NAME" \
    --name "$blob"
done

echo "Cleanup complete!"