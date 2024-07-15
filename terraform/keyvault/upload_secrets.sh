#!/bin/bash

vault_name=$1
env_file=$2

# Function to transform underscores to hyphens
transform_name() {
  echo "$1" | tr '_' '-'
}

while IFS= read -r line; do
  if [[ ! -z "$line" && ! "$line" =~ ^# ]]; then
    key=$(echo "$line" | cut -d '=' -f 1)
    value=$(echo "$line" | cut -d '=' -f 2-)
    transformed_key=$(transform_name "$key")

    if [[ -z "$transformed_key" ]]; then
      echo "Skipping invalid environment variable name: $key"
      continue
    fi

    echo "Setting secret: $transformed_key"
    az keyvault secret set --vault-name "$vault_name" --name "$transformed_key" --value "$value"
  fi
done < "$env_file"
