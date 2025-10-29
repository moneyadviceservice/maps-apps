#!/usr/bin/env bash
set -eu 
echo "Checking app has matching netlify site"

case "$PROJECT_NAME" in
    "adjustable-income-calculator")
        NETLIFY_SITE_ID="d242d610-70f7-4813-9056-8a26c443e701"
        NETLIFY_SITE_FILTER="adjustable-income-calculator"
        ;;
    "baby-cost-calculator")
        NETLIFY_SITE_ID="80001b34-5c40-4b3d-93a1-5f56fd956fa7"
        NETLIFY_SITE_FILTER="baby-cost-calculator"
        ;;
    "baby-money-timeline")
        NETLIFY_SITE_ID="fa79d6ed-3e49-4fd9-bbb8-902416cb7730"
        NETLIFY_SITE_FILTER="baby-money-timeline"
        ;;
    "budget-planner")
        NETLIFY_SITE_ID="13cdef71-1a54-4b21-9929-4ae07bb2994d"
        NETLIFY_SITE_FILTER="budget-planner"
        ;;
    "compare-accounts")
        NETLIFY_SITE_ID="3f39aceb-6f16-4c58-b904-1ba2b2c37576"
        NETLIFY_SITE_FILTER="compare-accounts"
        ;;
    "cash-in-chunks")
        NETLIFY_SITE_ID="1cb17c87-a16d-4072-bed5-8408f5d11d85"
        NETLIFY_SITE_FILTER="cash-in-chunks"
        ;;
    "credit-rejection")
        NETLIFY_SITE_ID="c7557609-066c-4a43-b797-2913b1b1bbb9"
        NETLIFY_SITE_FILTER="credit-rejection"
        ;;
    "debt-advice-locator")
        NETLIFY_SITE_ID="2ceaace0-b67f-4189-8f26-e2bf45b74300"
        NETLIFY_SITE_FILTER="debt-advice-locator"
        ;;
    "guaranteed-income-estimator")
        NETLIFY_SITE_ID="33fc1736-82c5-4b43-bbda-da5c0308c8d6"
        NETLIFY_SITE_FILTER="guaranteed-income-estimator"
        ;;
    "leave-pot-untouched")
        NETLIFY_SITE_ID="3ded150a-5c1d-40b6-b7e0-d963d48cb459"
        NETLIFY_SITE_FILTER="leave-pot-untouched"
        ;;
    "money-adviser-network")
        NETLIFY_SITE_ID="2f25fbee-8b6f-4f26-9f53-34c311cb9e2d"
        NETLIFY_SITE_FILTER="money-adviser-network"
        ;;
    "pensions-dashboard")
        NETLIFY_SITE_ID="1f0bf590-5ad7-40a2-813c-8c2a9334b19d"
        NETLIFY_SITE_FILTER="pensions-dashboard"
        ;;
    "moneyhelper-contact-forms")
        NETLIFY_SITE_ID="c376acd8-4eb8-4f70-af54-9cba2952974a"
        NETLIFY_SITE_FILTER="moneyhelper-contact-forms"
        ;;
    "moneyhelper-tools")
        NETLIFY_SITE_ID="0d476dfe-1f52-454b-9513-04e84a18d95c"
        NETLIFY_SITE_FILTER="moneyhelper-tools"
        ;;
    "mortgage-calculator")
        NETLIFY_SITE_ID="96d89c8b-1c25-4a32-a025-35c9ee9c6fea"
        NETLIFY_SITE_FILTER="mortgage-calculator"
        ;;
    "tools-index")
        NETLIFY_SITE_ID="d8ddcd9b-9600-4cee-9b1f-7eea759c63e3"
        NETLIFY_SITE_FILTER="tools-index"
        ;;
    "mortgage-affordability")
        NETLIFY_SITE_ID="e091cefe-7da0-4f0b-947c-629f98a6aacf"
        NETLIFY_SITE_FILTER="mortgage-affordability"
        ;;
    "redundancy-pay-calculator")
        NETLIFY_SITE_ID="cd563dc8-a79e-40b3-b127-53d0190e96f8"
        NETLIFY_SITE_FILTER="redundancy-pay-calculator"
        ;;
    "retirement-budget-planner")
        NETLIFY_SITE_ID="0ba4136f-3b22-4bef-a250-0fb1a5d76e68"
        NETLIFY_SITE_FILTER="retirement-budget-planner"
        ;;
    "sandbox")
        NETLIFY_SITE_ID="0e63f4cc-2819-4719-8329-fc093d409217"
        NETLIFY_SITE_FILTER="sandbox"
        ;;
    "savings-calculator")
        NETLIFY_SITE_ID="072c398a-cec0-48fa-af96-d2cb31338c41"
        NETLIFY_SITE_FILTER="savings-calculator"
        ;;
    "stamp-duty-calculator")
        NETLIFY_SITE_ID="fea3d9dc-d8ff-48b7-92fa-14129701327c"
        NETLIFY_SITE_FILTER="stamp-duty-calculator"
        ;;
    "credit-options")
        NETLIFY_SITE_ID="2f296234-567a-4fb4-a698-b11e229eb6e6"
        NETLIFY_SITE_FILTER="credit-options"
        ;;
    "take-whole-pot")
        NETLIFY_SITE_ID="42f321a2-b26e-4b99-b6a3-6773802caac1"
        NETLIFY_SITE_FILTER="take-whole-pot"
        ;;
    "pensionwise-triage")
        NETLIFY_SITE_ID="cfc0443a-8a71-435c-a231-8f6f0772c815"
        NETLIFY_SITE_FILTER="pensionwise-triage"
        ;;
    "pensionwise-appointment")
        NETLIFY_SITE_ID="5a06402b-1141-4675-9cc6-ebf477676397"
        NETLIFY_SITE_FILTER="pensionwise-appointment"
        ;;
    "standard-financial-statement")
        NETLIFY_SITE_ID="7d066c09-7fa7-4c66-97d0-d88ac4e57920"
        NETLIFY_SITE_FILTER="standard-financial-statement"
        ;;
    "evidence-hub")
        NETLIFY_SITE_ID="dc2e4b5e-7d82-44ba-8295-ca355685488b"
        NETLIFY_SITE_FILTER="evidence-hub"
        ;;
        "midlife-mot")
        NETLIFY_SITE_ID="60676bfa-7bd7-4655-9414-4532d7fe4a4a"
        NETLIFY_SITE_FILTER="midlife-mot"
        ;;
        "salary-calculator")
        NETLIFY_SITE_ID="70ff016f-4fc2-444e-a765-7f139e29a009"
        NETLIFY_SITE_FILTER="salary-calculator"
        ;;
    *)
    echo "Error: Unknown project name $PROJECT_NAME"
    exit 1
    ;;
esac

echo "Linking to Netlify site with ID: $NETLIFY_SITE_ID and filter: $NETLIFY_SITE_FILTER"
netlify link --id="$NETLIFY_SITE_ID" --filter="$NETLIFY_SITE_FILTER"

echo "NETLIFY_SITE_ID=$NETLIFY_SITE_ID" >> $GITHUB_ENV
echo "NETLIFY_SITE_FILTER=$NETLIFY_SITE_FILTER" >> $GITHUB_ENV
