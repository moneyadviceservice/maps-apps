resource "azurerm_log_analytics_workspace" "log_analytics" {
  name                = "${var.short_env}-${var.app_name}-log-analytics"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = var.short_env == "prod" ? 90 : 30
}
