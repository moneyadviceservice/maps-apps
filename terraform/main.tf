module "autoscale" {
  source              = "./modules/autoscale"
  name                = "${local.env}-${local.app}-autoscale"
  location            = var.location
  resource_group_name = local.resource_group_name
  target_resource_id  = local.app_service_plan_id
  default_capacity = {
    dev     = var.dev_default_capacity
    test    = var.test_default_capacity
    staging = var.staging_default_capacity
    prod    = var.production_default_capacity
  }[local.env]
  minimum_capacity = {
    dev     = var.dev_minimum_capacity
    test    = var.test_minimum_capacity
    staging = var.staging_minimum_capacity
    prod    = var.production_minimum_capacity
  }[local.env]
  maximum_capacity = {
    dev     = var.dev_maximum_capacity
    test    = var.test_maximum_capacity
    staging = var.staging_maximum_capacity
    prod    = var.production_maximum_capacity
  }[local.env]
}

module "monitor" {
  source              = "./modules/monitor"
  location            = var.location
  resource_group_name = local.resource_group_name
  apps                = var.apps
  environment         = local.environment
  short_env           = local.env
  app_name            = local.app
  webhook_url         = var.webhook_url
}

module "keyvault" {
  source              = "./modules/keyvault"
  location            = var.location
  resource_group_name = local.resource_group_name
  environment         = local.environment
  name                = "${local.env}-${local.app}-kv"
  apps                = { for app in var.apps : app.name => { instrumentation_key = module.monitor.instrumentation_keys[app.name] } }
}
