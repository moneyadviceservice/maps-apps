resource "azurerm_monitor_autoscale_setting" "autoscale" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  target_resource_id  = var.target_resource_id

  profile {
    name = "defaultProfile"

    capacity {
      default = var.default_capacity
      minimum = var.minimum_capacity
      maximum = var.maximum_capacity
    }

    rule {
      metric_trigger {
        metric_name        = "CpuPercentage"
        metric_resource_id = var.target_resource_id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "GreaterThan"
        threshold          = 70
      }

      scale_action {
        direction = "Increase"
        type      = "ChangeCount"
        value     = 1
        cooldown  = "PT5M"
      }
    }

    rule {
      metric_trigger {
        metric_name        = "CpuPercentage"
        metric_resource_id = var.target_resource_id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "LessThan"
        threshold          = 30
      }

      scale_action {
        direction = "Decrease"
        type      = "ChangeCount"
        value     = 1
        cooldown  = "PT5M"
      }
    }
  }
}
