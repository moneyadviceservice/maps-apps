#!/usr/bin/env bash
set -e

declare -A SITE_IDS=(
  ["adjustable-income-calculator"]="d242d610-70f7-4813-9056-8a26c443e701"
  ["baby-cost-calculator"]="80001b34-5c40-4b3d-93a1-5f56fd956fa7"
  ["baby-money-timeline"]="fa79d6ed-3e49-4fd9-bbb8-902416cb7730"
  ["budget-planner"]="13cdef71-1a54-4b21-9929-4ae07bb2994d"
  ["maps-shopping-list"]="bf121cab-029c-4768-af48-6d3db4e8c3bd"
  ["compare-accounts"]="3f39aceb-6f16-4c58-b904-1ba2b2c37576"
  ["cash-in-chunks"]="1cb17c87-a16d-4072-bed5-8408f5d11d85"
  ["credit-rejection"]="c7557609-066c-4a43-b797-2913b1b1bbb9"
  ["debt-advice-locator"]="2ceaace0-b67f-4189-8f26-e2bf45b74300"
  ["guaranteed-income-estimator"]="33fc1736-82c5-4b43-bbda-da5c0308c8d6"
  ["leave-pot-untouched"]="3ded150a-5c1d-40b6-b7e0-d963d48cb459"
  ["money-adviser-network"]="2f25fbee-8b6f-4f26-9f53-34c311cb9e2d"
  ["pensions-dashboard"]="1f0bf590-5ad7-40a2-813c-8c2a9334b19d"
  ["moneyhelper-contact-forms"]="c376acd8-4eb8-4f70-af54-9cba2952974a"
  ["moneyhelper-tools"]="0d476dfe-1f52-454b-9513-04e84a18d95c"
  ["mortgage-calculator"]="96d89c8b-1c25-4a32-a025-35c9ee9c6fea"
  ["tools-index"]="d8ddcd9b-9600-4cee-9b1f-7eea759c63e3"
  ["travel-insurance-directory"]="c1c64fb6-8394-4734-821c-27e6508f8f63"
  ["mortgage-affordability"]="e091cefe-7da0-4f0b-947c-629f98a6aacf"
  ["redundancy-pay-calculator"]="cd563dc8-a79e-40b3-b127-53d0190e96f8"
  ["retirement-budget-planner"]="0ba4136f-3b22-4bef-a250-0fb1a5d76e68"
  ["sandbox"]="0e63f4cc-2819-4719-8329-fc093d409217"
  ["savings-calculator"]="072c398a-cec0-48fa-af96-d2cb31338c41"
  ["stamp-duty-calculator"]="fea3d9dc-d8ff-48b7-92fa-14129701327c"
  ["credit-options"]="2f296234-567a-4fb4-a698-b11e229eb6e6"
  ["take-whole-pot"]="42f321a2-b26e-4b99-b6a3-6773802caac1"
  ["pensionwise-triage"]="cfc0443a-8a71-435c-a231-8f6f0772c815"
  ["pensionwise-appointment"]="5a06402b-1141-4675-9cc6-ebf477676397"
  ["standard-financial-statement"]="7d066c09-7fa7-4c66-97d0-d88ac4e57920"
  ["evidence-hub"]="dc2e4b5e-7d82-44ba-8295-ca355685488b"
  ["midlife-mot"]="60676bfa-7bd7-4655-9414-4532d7fe4a4a"
  ["salary-calculator"]="70ff016f-4fc2-444e-a765-7f139e29a009"
)

project=${PROJECT_NAME}

if [[ -z "${SITE_IDS[$project]}" ]]; then
  echo "Unknown project: $project"
  exit 1
fi

NETLIFY_SITE_ID="${SITE_IDS[$project]}"

echo "##vso[task.setvariable variable=NETLIFY_SITE_ID;isOutput=true]$NETLIFY_SITE_ID"