locals {
  environment = replace(terraform.workspace, "/^[-_]+|[-_]+$/", "")
  app         = split("_", local.environment)[1]
  env         = split("_", local.environment)[0]
  resource_group_name = {
    dev     = var.dev_resource_group
    test    = var.test_resource_group
    staging = var.staging_resource_group
    prod    = var.production_resource_group
  }[local.env]

  app_service_plan_id = {
    dev     = data.azurerm_service_plan.dev_asp.id
    test    = data.azurerm_service_plan.test_asp.id
    staging = data.azurerm_service_plan.staging_asp.id
    prod    = data.azurerm_service_plan.production_asp.id
  }[local.env]
}
