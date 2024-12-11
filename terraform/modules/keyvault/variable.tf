variable "location" {
  description = "Azure location for the resources"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group for the Key Vault"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., staging, production)"
  type        = string
}

variable "name" {
  description = "Name of the Key Vault"
  type        = string
}

variable "apps" {
  description = "Map of app names to their instrumentation keys"
  type        = map(object({
    instrumentation_key = string
  }))
}
