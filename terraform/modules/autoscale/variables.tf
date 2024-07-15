variable "name" {
  description = "The name of the autoscale setting"
  type        = string
}

variable "location" {
  description = "The location of the autoscale setting"
  type        = string
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "target_resource_id" {
  description = "The target resource ID for autoscale"
  type        = string
}

variable "default_capacity" {
  description = "The default capacity for autoscale"
  type        = number
}

variable "minimum_capacity" {
  description = "The minimum capacity for autoscale"
  type        = number
}

variable "maximum_capacity" {
  description = "The maximum capacity for autoscale"
  type        = number
}
