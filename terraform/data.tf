data "azurerm_service_plan" "staging_asp" {
  name                = var.staging_app_service_plan
  resource_group_name = var.staging_resource_group
}

data "azurerm_service_plan" "production_asp" {
  name                = var.production_app_service_plan
  resource_group_name = var.production_resource_group
}
