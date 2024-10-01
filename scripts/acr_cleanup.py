import os
import json
import subprocess
from datetime import datetime, timedelta, timezone
from azure.identity import DefaultAzureCredential
from azure.mgmt.containerregistry import ContainerRegistryManagementClient
from azure.containerregistry import ContainerRegistryClient, ArtifactTagOrder

def get_subscription_id():
    try:
        result = subprocess.run(["az", "account", "show"], capture_output=True, text=True, check=True)
        account_info = json.loads(result.stdout)
        return account_info['id']
    except subprocess.CalledProcessError as e:
        print("Failed to get subscription ID. Make sure you are logged in using 'az login'.")
        print(e)
        exit(1)

# Initialize the Azure credentials and clients
credential = DefaultAzureCredential()
subscription_id = get_subscription_id()
mgmt_client = ContainerRegistryManagementClient(credential, subscription_id)

# Set the cutoff period (60 days)
cutoff_period = timedelta(days=60)
cutoff_date = datetime.now(timezone.utc) - cutoff_period
print(f"Current Date (UTC): {datetime.now(timezone.utc)}")
print(f"Cutoff Date (UTC): {cutoff_date}")

# Allowed registry names and corresponding resource groups
allowed_registries = {
    "pensionwise": ["mapsnextjs-test-uksouth-rg"],
    "pensions": ["pensions-dashboard-review-uksouth-rg"],
    "moneyhelper": ["moneyhelper-review-uksouth-rg"]
}

def delete_old_acr_images(resource_group_name, registry_name):
    print(f"Processing ACR: {registry_name} in resource group: {resource_group_name}")

    # Create a ContainerRegistryClient for the specific registry
    registry_url = f"https://{registry_name}.azurecr.io"
    acr_client = ContainerRegistryClient(registry_url, credential)

    # Get the list of repositories in the ACR
    repositories = acr_client.list_repository_names()
    for repo in repositories:
        print(f"Processing repository: {repo}")

        # Get the list of tags for the repository
        tags = acr_client.list_tag_properties(repo, order_by=ArtifactTagOrder.LAST_UPDATED_ON_DESCENDING)
        for tag in tags:
            last_update_time = tag.last_updated_on

            # Check if the tag is older than 30 days
            if last_update_time < cutoff_date:
                print(f"Deleting tag: {tag.name} in repository: {repo} (Last Updated: {last_update_time})")
                acr_client.delete_tag(repo, tag.name)
            else:
                print(f"Tag {tag.name} in repository {repo} is not older than 30 days (Last Updated: {last_update_time})")

# Get the list of container registries
registries = mgmt_client.registries.list()
for registry in registries:
    resource_group_name = registry.id.split('/')[4]
    registry_name = registry.name
    if registry_name in allowed_registries and resource_group_name in allowed_registries[registry_name]:
        delete_old_acr_images(resource_group_name, registry_name)
    else:
        print(f"Skipping ACR: {registry_name} in resource group: {resource_group_name} as it is not in the allowed list")

print("Cleanup completed.")

