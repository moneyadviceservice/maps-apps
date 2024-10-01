resource "azurerm_monitor_diagnostic_setting" "diag_settings" {
  for_each            = { for app in var.apps : app.name => app }
  name                = "${each.key}-diag"
  target_resource_id  = azurerm_application_insights.app_insights[each.key].id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.log_analytics.id

  metric {
    category = "AllMetrics"
  }
}
