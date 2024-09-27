#!/bin/bash

# Function to set configurations based on application name
configure_app() {
  local app_name=$1
  case "$app_name" in
    "moneyhelper")
      appName="moneyhelper"
      location="uksouth"
      environments=("dev" "test" "test1" "staging" "prod")
      ;;
    # Add more applications here as needed
    *)
      echo "Unknown application: $app_name"
      exit 1
      ;;
  esac
}

# Function to create a resource group if it doesn't exist
create_resource_group() {
  local env=$1
  local rg_name="${appName}-${env}-${location}-rg"
  echo "Creating resource group: $rg_name"
  az group create --name "$rg_name" --location "$location" > /dev/null
  if [ $? -eq 0 ]; then
    echo "Resource group $rg_name created or already exists."
  else
    echo "Failed to create resource group $rg_name."
    exit 1
  fi
}

# Function to check if a resource exists
resource_exists() {
  local resource_type=$1
  local resource_name=$2
  local rg_name=$3

  az resource show --resource-group "$rg_name" --resource-type "$resource_type" --name "$resource_name" > /dev/null 2>&1
  return $?
}

# Function to deploy using ARM template if resources do not exist
deploy_resources() {
  local env=$1
  local rg_name="${appName}-${env}-${location}-rg"
  local param_file="parameters/${appName}/appserviceandplan-${appName}-${env}.parameters.json"
  local app_service_plan_name
  local app_name

  if [ ! -f "$param_file" ]; then
    echo "Parameter file $param_file does not exist."
    exit 1
  fi

  # Extract parameters from the parameter file
  app_service_plan_name=$(jq -r '.parameters.appServicePlanName.value' < "$param_file")
  app_name=$(jq -r '.parameters.appName.value' < "$param_file")

  echo "Checking if App Service Plan $app_service_plan_name exists in resource group $rg_name..."
  resource_exists "Microsoft.Web/serverfarms" "$app_service_plan_name" "$rg_name"
  if [ $? -eq 0 ]; then
    echo "App Service Plan $app_service_plan_name already exists in resource group $rg_name."
  else
    echo "App Service Plan $app_service_plan_name does not exist. Proceeding with deployment."
    echo "Deploying resources to $rg_name using $param_file"
    az deployment group create \
      --name "${appName}-${env}-deployment" \
      --resource-group "$rg_name" \
      --template-file "arm-templates/appserviceandplan.json" \
      --parameters "@$param_file"

    if [ $? -eq 0 ]; then
      echo "Deployment to $rg_name succeeded."
    else
      echo "Deployment to $rg_name failed."
      exit 1
    fi
  fi

  echo "Checking if Web App $app_name exists in resource group $rg_name..."
  resource_exists "Microsoft.Web/sites" "$app_name" "$rg_name"
  if [ $? -eq 0 ]; then
    echo "Web App $app_name already exists in resource group $rg_name."
  else
    echo "Web App $app_name does not exist. Proceeding with deployment."
    echo "Deploying resources to $rg_name using $param_file"
    az deployment group create \
      --name "${appName}-${env}-deployment" \
      --resource-group "$rg_name" \
      --template-file "arm-templates/appserviceandplan.json" \
      --parameters "@$param_file"

    if [ $? -eq 0 ]; then
      echo "Deployment to $rg_name succeeded."
    else
      echo "Deployment to $rg_name failed."
      exit 1
    fi
  fi
}

# Main script
main() {
  configure_app "moneyhelper"

  for env in "${environments[@]}"; do
    create_resource_group "$env"
    deploy_resources "$env"
  done
}

main
