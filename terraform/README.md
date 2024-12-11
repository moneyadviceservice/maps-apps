### README for Terraform Deployment and Management

## Overview

This repository contains scripts and configurations for managing Azure resources using Terraform. The main script, `terraform_deploy.sh`, handles the initialisation, workspace selection, planning, and applying Terraform configurations for different environments (staging and production).

## Prerequisites

1. **Azure CLI**: Ensure you have the Azure CLI installed and configured. You can install the Azure CLI from [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).
2. **Terraform**: Ensure you have Terraform installed. You can download Terraform from [here](https://www.terraform.io/downloads.html).
3. **Azure Account**: You need to be logged in to your Azure account using the Azure CLI. You can log in by running:

   ```bash
   az login
   ```

## Structure

```plaintext
terraform/
├── main.tf
├── provider.tf
├── data.tf
├── variables.tf
├── terraform.tfvars
└── modules/
    └── autoscale/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
scripts/
└── terraform_deploy.sh
```

## terraform_deploy.sh

The `terraform_deploy.sh` script is designed to automate the deployment process using Terraform. It includes functions to initialise Terraform, select workspaces, plan, and apply changes with auto-approve.

### Usage

1. **Set Up the Script**: Ensure the script has execution permissions.

   ```bash
   chmod +x ../scripts/terraform_deploy.sh
   ```

2. **Run the Script**: Execute the script with the desired environment and action.

- For planning changes in the staging environment:

  ```bash
  ../scripts/terraform_deploy.sh staging plan
  ```

- For applying changes in the production environment:

  ```bash
  ../scripts/terraform_deploy.sh prod apply
  ```

- For planning changes in both environments:

  ```bash
  ../scripts/terraform_deploy.sh all plan
  ```

- For applying changes in both environments:

  ```bash
  ../scripts/terraform_deploy.sh all apply
  ```

### Script Modification

The `terraform_deploy.sh` script can be modified to suit your application’s specific requirements. Depending on the variables defined in the `terraform.tfvars` file, you can adjust the script to manage different environments or resources as needed.

## Conclusion

This repository provides scripts for managing Azure resources and deploying Terraform configurations. The `terraform_deploy.sh` script automates the Terraform deployment process for different environments. Modify the script to suit your requirements and ensure you have the necessary permissions before running it.
