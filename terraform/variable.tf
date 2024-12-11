variable "location" {
  description = "Azure location for the resources"
  default     = "uksouth"
}

# Dev Environment
variable "dev_resource_group" {}
variable "dev_app_service_plan" {}
variable "dev_default_capacity" {}
variable "dev_minimum_capacity" {}
variable "dev_maximum_capacity" {}

# Test Environment
variable "test_resource_group" {}
variable "test_app_service_plan" {}
variable "test_default_capacity" {}
variable "test_minimum_capacity" {}

variable "test_maximum_capacity" {}

# Staging Environment
variable "staging_resource_group" {}
variable "staging_app_service_plan" {}
variable "staging_default_capacity" {}
variable "staging_minimum_capacity" {}
variable "staging_maximum_capacity" {}

# Production Environment
variable "production_resource_group" {}
variable "production_app_service_plan" {}
variable "production_default_capacity" {}
variable "production_minimum_capacity" {}
variable "production_maximum_capacity" {}
variable "webhook_url" {}

variable "apps" {
  description = "List of applications to monitor"
  type = list(object({
    name = string
  }))
}
