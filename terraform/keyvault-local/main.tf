# Define the resource groups
resource "azurerm_resource_group" "pensionwise" {
  name     = "pensionwise-keyvault-rg"
  location = "uksouth"
}

resource "azurerm_resource_group" "moneyhelper" {
  name     = "moneyhelper-keyvault-rg"
  location = "uksouth"
}

resource "azurerm_resource_group" "pensions" {
  name     = "pensions-keyvault-rg"
  location = "uksouth"
}

# Define Key Vaults and associated .env files
variable "key_vaults" {
  type = list(object({
    name                = string
    resource_group_name = string
    env_file            = string
  }))
  default = [
    {
      name                = "pensionwise-dev"
      resource_group_name = "pensionwise-keyvault-rg"
      env_file            = "../pensionwise-dev.env"
    },
    {
      name                = "pensionwise-review"
      resource_group_name = "pensionwise-keyvault-rg"
      env_file            = "../pensionwise-dev.env"
    },
    {
      name                = "pensionwise-test"
      resource_group_name = "pensionwise-keyvault-rg"
      env_file            = "../pensionwise-test.env"
    },
    {
      name                = "pensionwise-staging"
      resource_group_name = "pensionwise-keyvault-rg"
      env_file            = "../pensionwise-staging.env"
    },
    {
      name                = "pensionwise-prod"
      resource_group_name = "pensionwise-keyvault-rg"
      env_file            = "../pensionwise-prod.env"
    },
    {
      name                = "moneyhelper-dev"
      resource_group_name = "moneyhelper-keyvault-rg"
      env_file            = "../moneyhelper-dev.env"
    },
    {
      name                = "moneyhelper-review"
      resource_group_name = "moneyhelper-keyvault-rg"
      env_file            = "../moneyhelper-dev.env"
    },
    {
      name                = "moneyhelper-test"
      resource_group_name = "moneyhelper-keyvault-rg"
      env_file            = "../moneyhelper-test.env"
    },
    {
      name                = "moneyhelper-staging"
      resource_group_name = "moneyhelper-keyvault-rg"
      env_file            = "../moneyhelper-staging.env"
    },
    {
      name                = "moneyhelper-prod"
      resource_group_name = "moneyhelper-keyvault-rg"
      env_file            = "../moneyhelper-prod.env"
    },
    {
      name                = "pensions-dev"
      resource_group_name = "pensions-keyvault-rg"
      env_file            = "../pensions-dev.env"
    },
    {
      name                = "pensions-review"
      resource_group_name = "pensions-keyvault-rg"
      env_file            = "../pensions-dev.env"
    }
  ]
}

# Create Key Vaults
resource "azurerm_key_vault" "kv" {
  for_each            = { for kv in var.key_vaults : kv.name => kv }
  name                = each.value.name
  location            = azurerm_resource_group.moneyhelper.location
  resource_group_name = each.value.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get",
      "Set",
      "List"
    ]
  }
}

resource "null_resource" "upload_secrets" {
  for_each = { for kv in var.key_vaults : kv.name => kv }

  provisioner "local-exec" {
    command = "bash upload_secrets.sh ${each.value.name} ${each.value.env_file}"
  }

  depends_on = [azurerm_key_vault.kv]
}

# Azure client configuration
data "azurerm_client_config" "current" {}
