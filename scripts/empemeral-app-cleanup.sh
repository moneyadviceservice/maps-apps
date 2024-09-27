#!/bin/bash

resource_group=$1
pr_id_list=$2

echo "Parameters: Resource group $1, pridlist - $2"

IFS=',' read -r -a pr_id_list <<< "$pr_id_list"
webapp_names=$(az webapp list --resource-group "$resource_group" --query "[].name" -o tsv)

for webapp in $webapp_names; do
  last_four=${webapp: -4}
  match_found=false

  for pr_id in "${pr_id_list[@]}"; do
    if [[ "$last_four" == "$pr_id" ]]; then
      match_found=true
      echo "Web app $webapp is active so not deleted"
      break
    fi
  done

  if [ "$match_found" = false ]; then
    echo "Deleting web app: $webapp"
    az webapp delete --name "$webapp" --resource-group "$resource_group"
  fi
done
