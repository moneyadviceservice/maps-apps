resource "azurerm_key_vault" "key_vault" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get",
      "Set",
      "List"
    ]
  }
}

resource "azurerm_key_vault_secret" "instrumentation_key" {
  for_each            = var.apps
  name                = "${each.key}-instrumentation-key"
  value               = each.value.instrumentation_key
  key_vault_id        = azurerm_key_vault.key_vault.id
}
