# Determine the environment based on the Terraform workspace
locals {
  environment = terraform.workspace
}

module "autoscale" {
  source              = "./modules/autoscale"
  name                = "${local.environment}-autoscale"
  location            = var.location
  resource_group_name = local.environment == "staging" ? var.staging_resource_group : var.production_resource_group
  target_resource_id  = local.environment == "staging" ? data.azurerm_service_plan.staging_asp.id : data.azurerm_service_plan.production_asp.id
  default_capacity    = local.environment == "staging" ? var.staging_default_capacity : var.production_default_capacity
  minimum_capacity    = local.environment == "staging" ? var.staging_minimum_capacity : var.production_minimum_capacity
  maximum_capacity    = local.environment == "staging" ? var.staging_maximum_capacity : var.production_maximum_capacity
}
