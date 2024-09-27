resource "azurerm_application_insights" "app_insights" {
  for_each            = { for app in var.apps : app.name => app }
  name                = "${each.key}-${var.environment}-app-insights"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = "web"
  retention_in_days   = var.environment == "prod" ? 90 : 30
}
