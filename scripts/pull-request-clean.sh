#!/bin/bash

# Set the resource groups array (Add the resource groups you want to clean up)
RESOURCE_GROUPS=("pensionwise-review-uksouth-rg")

# Get the current date and date 7 days ago
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SEVEN_DAYS_AGO=$(date -u -d "7 days ago" +"%Y-%m-%dT%H:%M:%SZ")

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found, please install jq to proceed."
    exit 1
fi

# Iterate through each resource group
for RESOURCE_GROUP in "${RESOURCE_GROUPS[@]}"
do
    echo "Processing resource group: $RESOURCE_GROUP"

    # List App Services created more than 7 days ago
    APP_SERVICES=$(az resource list --resource-group $RESOURCE_GROUP --resource-type "Microsoft.Web/sites" --query "[?createdTime<'$SEVEN_DAYS_AGO'].{name:name,createdTime:createdTime}" -o json)

    # Iterate through the list and delete each App Service
    for app in $(echo "$APP_SERVICES" | jq -c '.[]'); do
        NAME=$(echo "$app" | jq -r '.name')
        echo "Deleting App Service: $NAME"
        az webapp delete --name "$NAME" --resource-group "$RESOURCE_GROUP"
    done
done