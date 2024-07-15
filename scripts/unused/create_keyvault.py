import os
import subprocess
import time
from dotenv import load_dotenv
from azure.identity import AzureCliCredential
from azure.keyvault.secrets import SecretClient
from azure.core.exceptions import AzureError, ServiceRequestError
from azure.mgmt.keyvault import KeyVaultManagementClient
from azure.mgmt.keyvault.models import VaultCreateOrUpdateParameters, Sku, SkuName, VaultProperties, AccessPolicyEntry, Permissions, SecretPermissions
from azure.mgmt.resource import ResourceManagementClient

# Define the Key Vault names and resource groups
key_vault_names = [
    "pensionwise-dev", "pensionwise-test", "pensionwise-staging", "pensionwise-prod",
    "moneyhelper-dev", "moneyhelper-test", "moneyhelper-staging", "moneyhelper-prod"
]
pensionwise_rg = "pensionwise-rg"
moneyhelper_rg = "moneyhelper-rg"
location = "uksouth"  # Adjust the location as needed

# Initialize clients using AzureCliCredential
credential = AzureCliCredential()
subscription_id = subprocess.run(["az", "account", "show", "--query", "id", "-o", "tsv"], capture_output=True, text=True).stdout.strip()
resource_client = ResourceManagementClient(credential, subscription_id)
kv_client = KeyVaultManagementClient(credential, subscription_id)

# Fetch tenant ID from the CLI account information
tenant_id = subprocess.run(["az", "account", "show", "--query", "tenantId", "-o", "tsv"], capture_output=True, text=True).stdout.strip()

# Determine if the signed-in account is a user or a service principal
account_info = subprocess.run(["az", "account", "show", "--query", "user.type", "-o", "tsv"], capture_output=True, text=True).stdout.strip()

# Fetch the object ID based on the account type
if account_info == "user":
    upn = subprocess.run(["az", "account", "show", "--query", "user.name", "-o", "tsv"], capture_output=True, text=True).stdout.strip()
    object_id_process = subprocess.run(["az", "ad", "user", "show", "--id", upn, "--query", "id", "-o", "tsv"], capture_output=True, text=True)
    object_id = object_id_process.stdout.strip()
    if object_id_process.returncode != 0:
        print(f"Failed to fetch object ID for the signed-in user {upn}: {object_id_process.stderr}")
        exit(1)
elif account_info == "servicePrincipal":
    spn = subprocess.run(["az", "account", "show", "--query", "user.name", "-o", "tsv"], capture_output=True, text=True).stdout.strip()
    object_id_process = subprocess.run(["az", "ad", "sp", "show", "--id", spn, "--query", "id", "-o", "tsv"], capture_output=True, text=True)
    object_id = object_id_process.stdout.strip()
    if object_id_process.returncode != 0:
        print(f"Failed to fetch object ID for the signed-in service principal {spn}: {object_id_process.stderr}")
        exit(1)
else:
    print("Error: Unable to determine the account type of the signed-in user.")
    exit(1)

# Check if the object_id is valid
if not object_id:
    print(f"Error: Unable to fetch the object ID for the signed-in user.")
    exit(1)

print(f"Using object ID: {object_id}")

# Function to create a resource group if it doesn't exist
def create_resource_group(resource_group_name):
    rg_params = {'location': location}
    resource_client.resource_groups.create_or_update(resource_group_name, rg_params)

# Function to create a Key Vault if it doesn't exist
def create_key_vault(vault_name, resource_group_name):
    access_policies = [
        AccessPolicyEntry(
            tenant_id=tenant_id,
            object_id=object_id,
            permissions=Permissions(secrets=[SecretPermissions.get, SecretPermissions.set])
        )
    ]
    vault_properties = VaultProperties(tenant_id=tenant_id, sku=Sku(name=SkuName.standard), access_policies=access_policies)
    vault_params = VaultCreateOrUpdateParameters(location=location, properties=vault_properties)
    kv_client.vaults.begin_create_or_update(resource_group_name, vault_name, vault_params).result()

# Function to set environment variables in Key Vault
def set_env_variables_in_keyvault(vault_name, env_file):
    # Load environment variables from the file
    load_dotenv(env_file)

    # Create a SecretClient
    key_vault_url = f"https://{vault_name}.vault.azure.net"
    print(f"Connecting to Key Vault URL: {key_vault_url}")

    try:
        client = SecretClient(vault_url=key_vault_url, credential=credential)
        print(f"Successfully created SecretClient for Key Vault: {vault_name}")
    except Exception as e:
        print(f"Failed to create SecretClient for Key Vault {vault_name}: {str(e)}")
        return

    # Iterate through the environment variables and set them in the Key Vault
    for key, value in os.environ.items():
        for attempt in range(3):  # Retry up to 3 times
            try:
                print(f"Setting {key} in Key Vault {vault_name}")
                client.set_secret(key, value)
                print(f"Successfully set {key} in Key Vault {vault_name}")
                break
            except ServiceRequestError as e:
                print(f"Network error occurred: {str(e)}")
                time.sleep(5)  # Wait for 5 seconds before retrying
            except AzureError as e:
                print(f"Failed to set {key} in Key Vault {vault_name}: {str(e)}")
                break

# Create resource groups if they don't exist
create_resource_group(pensionwise_rg)
create_resource_group(moneyhelper_rg)

# Create Key Vaults and set environment variables
for vault_name in key_vault_names:
    if vault_name.startswith("pensionwise"):
        resource_group_name = pensionwise_rg
    elif vault_name.startswith("moneyhelper"):
        resource_group_name = moneyhelper_rg
    else:
        print(f"Unknown prefix for Key Vault {vault_name}, skipping.")
        continue

    print(f"Processing Key Vault: {vault_name} in Resource Group: {resource_group_name}")
    try:
        create_key_vault(vault_name, resource_group_name)
        env_file = f"{vault_name}.env"  # Assuming each Key Vault has a corresponding .env file
        if os.path.exists(env_file):
            print(f"Processing environment file {env_file} for Key Vault {vault_name}")
            set_env_variables_in_keyvault(vault_name, env_file)
        else:
            print(f"Environment file {env_file} not found")
    except Exception as e:
        print(f"Failed to process Key Vault {vault_name}: {str(e)}")

print("Environment variables have been set in the Key Vaults.")
