resource "azurerm_monitor_metric_alert" "metric_alert" {
  for_each            = { for app in var.apps : app.name => app }
  name                = "${each.key}-${var.environment}-metric-alert"
  resource_group_name = var.resource_group_name
  scopes              = [azurerm_application_insights.app_insights[each.key].id]
  description         = "Metric alert for ${each.key} in ${var.environment} environment"
  severity            = 3
  window_size         = "PT5M"

  criteria {
    metric_namespace     = "Microsoft.Insights/components"
    metric_name          = "requests/count"
    operator             = "GreaterThan"
    threshold            = 100
    aggregation          = "Count"

  }

  action {
    action_group_id = azurerm_monitor_action_group.action_group.id
  }
}
