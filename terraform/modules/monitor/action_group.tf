resource "azurerm_monitor_action_group" "action_group" {
  name                = "${var.environment}-action-group"
  resource_group_name = var.resource_group_name
  short_name          = "act-grp"

  # email_receiver {
  #   name          = "default-email"
  #   email_address = var.alert_email_address
  # }


  webhook_receiver {
    name        = "notifier-webhook"
    service_uri = var.webhook_url
  }
}
