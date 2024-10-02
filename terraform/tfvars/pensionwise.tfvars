location = "uksouth"
apps = [
  {
    name = "pensionwise"
  }
]
dev_resource_group          = "mapsnextjs-dev-uksouth-rg"
dev_app_service_plan        = "pensionwise"
test_resource_group         = "mapsnextjs-test-uksouth-rg"
test_app_service_plan       = "pensionwise"
staging_resource_group      = "pensionwise-staging-uksouth-rg"
staging_app_service_plan    = "pensionwise-staging-uksouth-asp"
production_resource_group   = "pensionwise-prod-uksouth-rg"
production_app_service_plan = "pensionwise-prod-uksouth-asp"
dev_default_capacity        = 1
dev_minimum_capacity        = 1
dev_maximum_capacity        = 1
test_default_capacity       = 1
test_minimum_capacity       = 1
test_maximum_capacity       = 1
staging_default_capacity    = 1
staging_minimum_capacity    = 1
staging_maximum_capacity    = 3
production_default_capacity = 2
production_minimum_capacity = 2
production_maximum_capacity = 5
webhook_url                 = "https://mapsorg.webhook.office.com/webhookb2/68339074-4443-4ac9-8e76-584b8d08c5f9@bbe41032-8fce-4d42-bab5-44e21510886d/IncomingWebhook/d70e960de1fa4f489ad4a5c1c385a47d/12239265-2c88-4463-af5f-a9386d796779"
