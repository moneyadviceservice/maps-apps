#!/bin/bash


# Define the Key Vault names and their corresponding resource groups
KEY_VAULT_NAMES=("money-dev" "money-test" "money-staging" "money-prod" "money-review")

LOCATION="uksouth"

# Function to check if a Key Vault exists
check_key_vault_exists() {
  az keyvault show --name "$1" &> /dev/null
  return $?
}

# Function to create a Key Vault if it doesn't exist
create_key_vault() {
  if check_key_vault_exists "$1"; then
    echo "Key Vault $1 already exists. Skipping creation."
  else
    echo "Creating Key Vault $1 in Resource Group $2"
    az keyvault create --name "$1" --resource-group "$2" --location "$LOCATION" --sku standard
  fi
}

# Function to validate and format secret name
format_secret_name() {
  echo "$1" | tr '_' '-'
}

# Function to set environment variables in Key Vault
set_env_variables_in_keyvault() {
  local vault_name=$1
  local env_file=$2

  if [ ! -f "$env_file" ]; then
    echo "Environment file $env_file not found for $vault_name"
    return
  fi

  echo "Processing environment file $env_file for Key Vault $vault_name"
  export $(cat "$env_file" | xargs)

  for key in $(awk -F= '{print $1}' "$env_file"); do
    local value=${!key}
    local valid_key=$(format_secret_name "$key")

    echo "Setting $valid_key in Key Vault $vault_name"
    az keyvault secret set --vault-name "$vault_name" --name "$valid_key" --value "$value"
  done
}

# Determine the resource group for a given key vault
get_resource_group() {
  local vault_name=$1
  if [[ $vault_name == money-* ]]; then
    echo "money-keyvault-rg"
  else
    echo "Unknown resource group for $vault_name"
    exit 1
  fi
}

# Loop through each Key Vault and process
for vault_name in "${KEY_VAULT_NAMES[@]}"; do
  resource_group_name=$(get_resource_group "$vault_name")

  echo "Processing Key Vault: $vault_name in Resource Group: $resource_group_name"

  # Create Key Vault if it doesn't exist
  create_key_vault "$vault_name" "$resource_group_name"

  # Set environment variables in Key Vault
  env_file="${vault_name}.env"
  set_env_variables_in_keyvault "$vault_name" "$env_file"
done

echo "Environment variables have been set in the Key Vaults."
