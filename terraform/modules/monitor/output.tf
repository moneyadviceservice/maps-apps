output "instrumentation_keys" {
  value = { for k, v in azurerm_application_insights.app_insights : k => v.instrumentation_key }
}

output "log_analytics_workspace" {
  value = azurerm_log_analytics_workspace.log_analytics
}

output "action_group_id" {
  value = azurerm_monitor_action_group.action_group.id
}
