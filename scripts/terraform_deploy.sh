#!/bin/bash

# Function to initialize Terraform with a specific state file
initialize_terraform() {
  local env=$1
  local app=$2
  local key="terraform.tfstate.d/${env}_${app}/terraform.tfstate"
  echo "Initializing Terraform for $app in $env environment..."
  rm -rf .terraform terraform.tfstate*
  terraform init \
    -backend-config="resource_group_name=terraform-backend-rg" \
    -backend-config="storage_account_name=mapsappsstore" \
    -backend-config="container_name=tfstate" \
    -backend-config="key=$key" \
    -reconfigure
}

# Function to select or create the Terraform workspace
select_workspace() {
  local env=$1
  local app=$2
  local workspace="${env}_${app}"
  echo "Selecting Terraform workspace: $workspace"
  terraform workspace select $workspace || terraform workspace new $workspace
}

# Function to plan Terraform changes
plan_terraform() {
  local app=$1
  echo "Planning Terraform changes for $app..."
  terraform plan -var-file="tfvars/${app}.tfvars"
}

# Function to apply Terraform changes with auto-approve
apply_terraform() {
  local app=$1
  echo "Applying Terraform changes for $app..."
  terraform apply -var-file="tfvars/${app}.tfvars" -auto-approve
}

# Function to destroy Terraform-managed infrastructure with auto-approve
destroy_terraform() {
  local app=$1
  echo "Destroying Terraform-managed infrastructure for $app..."
  terraform destroy -var-file="tfvars/${app}.tfvars" -auto-approve
}

# Main function to run Terraform commands based on the environment
run_terraform() {
  local env=$1
  local action=$2
  local app=$3

  initialize_terraform $env $app
  select_workspace $env $app

  case $action in
    plan)
      plan_terraform $app
      ;;
    apply)
      apply_terraform $app
      ;;
    destroy)
      destroy_terraform $app
      ;;
    *)
      echo "Invalid action. Use 'plan', 'apply', or 'destroy'."
      exit 1
      ;;
  esac
}

# Run the script for multiple environments
run_all() {
  local action=$1
  local app=$2

  for env in dev test staging prod;
  do
    run_terraform $env $action $app
  done
}

# Check for environment, action, and app arguments
if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <env|all> <plan|apply|destroy> <app>"
  exit 1
fi

# Get the environment, action, and app arguments
env=$1
action=$2
app=$3

# Run Terraform commands based on the input arguments
if [[ $env == "all" ]]; then
  run_all $action $app
else
  run_terraform $env $action $app
fi
