#!/usr/bin/env bash
set -eu 

az login --service-principal --username "$AKS_SPN_ID" --password "$AKS_SPN_KEY" --tenant "$TENANT_ID"
STORAGE_ACCOUNT="mapsplaywrightreports"
CONTAINER_NAME="$PROJECT_NAME"
ACCOUNT_KEY=$(az storage account keys list --account-name "$STORAGE_ACCOUNT" --query "[0].value" --output tsv)

echo "Ensuring storage container $CONTAINER_NAME exists in $STORAGE_ACCOUNT..."
EXISTS=$(az storage container exists --account-name "$STORAGE_ACCOUNT" --account-key "$ACCOUNT_KEY" --name "$CONTAINER_NAME" --auth-mode key --query exists --output tsv)

if [ "$EXISTS" != "true" ]; then
    echo "Creating storage container: $CONTAINER_NAME"
    az storage container create --account-name "$STORAGE_ACCOUNT" --account-key "$ACCOUNT_KEY" --name "$CONTAINER_NAME" --auth-mode key
else
    echo "Storage container $CONTAINER_NAME already exists."
fi