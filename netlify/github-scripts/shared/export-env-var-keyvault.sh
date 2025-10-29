#!/usr/bin/env bash
set -eu

keyvaultname="${KEYVAULT_NAME}"

az login --service-principal \
  --username "${AKS_SPN_ID}" \
  --password "${AKS_SPN_KEY}" \
  --tenant "${TENANT_ID}"

echo "Fetching secrets from Key Vault: $keyvaultname"
secrets=$(az keyvault secret list --vault-name $keyvaultname --query "[].name" -o tsv)
echo "Secrets found: $secrets"

for secretName in $secrets; do
    secretValue=$(az keyvault secret show --name $secretName --vault-name $keyvaultname --query "value" -o tsv)

    # Replace dashes with underscores in secret names to form valid environment variable names
    secretName="${secretName//-/_}"

    # Set the environment variable for the pipeline
    echo "$secretName=$secretValue" >> $GITHUB_ENV
done

