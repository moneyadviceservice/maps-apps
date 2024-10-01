variable "location" {
  description = "Location for resources"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "apps" {
  description = "List of apps with details"
  type = list(object({
    name = string
  }))
}

variable "environment" {
  description = "Environment"
  type        = string
}

variable "short_env" {
  description = "Shortened environment name"
  type        = string
}

variable "app_name" {
  description = "App name"
  type        = string
}

# variable "alert_email_address" {
#   description = "Email address for alert notifications"
#   type        = string
# }


variable "webhook_url" {
  description = "Webhook URL for alert notifications"
  type        = string
}
