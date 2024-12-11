data "azurerm_service_plan" "dev_asp" {
  name                = var.dev_app_service_plan
  resource_group_name = var.dev_resource_group
}

data "azurerm_service_plan" "test_asp" {
  name                = var.test_app_service_plan
  resource_group_name = var.test_resource_group
}

data "azurerm_service_plan" "staging_asp" {
  name                = var.staging_app_service_plan
  resource_group_name = var.staging_resource_group
}

data "azurerm_service_plan" "production_asp" {
  name                = var.production_app_service_plan
  resource_group_name = var.production_resource_group
}

data "azurerm_resource_group" "dev" {
  name = var.dev_resource_group
}

data "azurerm_resource_group" "test" {
  name = var.test_resource_group
}

data "azurerm_resource_group" "staging" {
  name = var.staging_resource_group
}

data "azurerm_resource_group" "production" {
  name = var.production_resource_group
}

data "azurerm_client_config" "current" {}
