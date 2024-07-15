#!/bin/bash

# Function to initialize Terraform
initialize_terraform() {
  echo "Initializing Terraform..."
  terraform init
}

# Function to select the Terraform workspace
select_workspace() {
  local env=$1
  echo "Selecting Terraform workspace: $env"
  terraform workspace select $env || terraform workspace new $env
}

# Function to plan Terraform changes
plan_terraform() {
  echo "Planning Terraform changes for $1..."
  terraform plan -var-file=terraform.tfvars
}

# Function to apply Terraform changes with auto-approve
apply_terraform() {
  echo "Applying Terraform changes for $1..."
  terraform apply -var-file=terraform.tfvars -auto-approve
}

# Main function to run Terraform commands based on the environment
run_terraform() {
  local env=$1
  local action=$2

  initialize_terraform
  select_workspace $env

  case $action in
    plan)
      plan_terraform $env
      ;;
    apply)
      apply_terraform $env
      ;;
    *)
      echo "Invalid action. Use 'plan' or 'apply'."
      exit 1
      ;;
  esac
}

# Run the script for both staging and production environments
run_all() {
  local action=$1

  for env in staging prod;
  do
    run_terraform $env $action
  done
}

# Check for environment and action arguments
if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <env|all> <plan|apply>"
  exit 1
fi

# Get the environment and action arguments
env=$1
action=$2

# Run Terraform commands based on the input arguments
if [[ $env == "all" ]]; then
  run_all $action
else
  run_terraform $env $action
fi
