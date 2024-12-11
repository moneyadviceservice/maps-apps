#!/bin/bash

# Azure region (default: UK South)
LOCATION="UK South"

# Array of resource group names
RESOURCE_GROUPS=(
  "money-test-uksouth-rg"
  "money-dev-uksouth-rg"
  "money-prod-uksouth-rg"
  "money-staging-uksouth-rg"
  "money-review-uksouth-rg"
  "money-keyvault-rg"
)

# Create each resource group
for RG in "${RESOURCE_GROUPS[@]}"; do
  echo "Creating resource group: $RG in $LOCATION..."
  az group create --name "$RG" --location "$LOCATION" \
  && echo "Resource group $RG created successfully." \
  || echo "Failed to create resource group $RG."
done

echo "All resource groups created."
