variable "location" {
  description = "Azure location for the resources"
  default     = "uksouth"
}

variable "staging_resource_group" {
  description = "Resource group for staging environment"
  default     = "pensionwise-staging-uksouth-rg"
}

variable "production_resource_group" {
  description = "Resource group for production environment"
  default     = "pensionwise-prod-uksouth-rg"
}

variable "staging_app_service_plan" {
  description = "App Service Plan for staging environment"
  default     = "pensionwise-staging-uksouth-asp"
}

variable "production_app_service_plan" {
  description = "App Service Plan for production environment"
  default     = "pensionwise-prod-uksouth-asp"
}

variable "staging_default_capacity" {
  description = "Default capacity for staging autoscale"
  default     = 1
}

variable "staging_minimum_capacity" {
  description = "Minimum capacity for staging autoscale"
  default     = 1
}

variable "staging_maximum_capacity" {
  description = "Maximum capacity for staging autoscale"
  default     = 3
}

variable "production_default_capacity" {
  description = "Default capacity for production autoscale"
  default     = 2
}

variable "production_minimum_capacity" {
  description = "Minimum capacity for production autoscale"
  default     = 2
}

variable "production_maximum_capacity" {
  description = "Maximum capacity for production autoscale"
  default     = 5
}
