terraform {
  backend "azurerm" {
    resource_group_name   = "terraform-backend-rg"
    storage_account_name  = "mapsappsstore"
    container_name        = "tfstate"
    key                   = "${terraform.workspace}/terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}
