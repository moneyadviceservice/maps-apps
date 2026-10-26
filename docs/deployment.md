## Deployment & CI/CD

### Pipeline Overview

- **content-synch.yml** - Content synchronization with AEM
- **github-synch.yml** - Push code from this repo to GitHub repository
- **dependabot-pipeline.yml** - Weekly dependency and vulnerability checks

| Pipeline Name                                                                                                                                | Trigger   | Description                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Netlify - PR Review](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=359)                          | PR        | Runs code analysis and e2e tests in parallel to netlify creating deploy previews                                                                                                                                |
| [Netlify - Develop on Merge](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=354)                   | PR Merged | Runs e2e tests on affected apps, automatically tags user stories with automation work, resets develop with main and commits, netlify builds dev environment for affected apps (develop--<app_name>.netlify.app) |
| [Netlify - Deploy to Environment](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=352)              | Manual    | Deploys specific app and branch (usually main) to test or staging (e2e tests optional, enabled via pipeline parameter, urls test--<app_name>.netlify.app and staging--<app_name>.netlify.app)                   |
| [Netlify - Branch to Environment](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=447)              | Manual    | Allows teams to create a production build of a branch, which can then be published to the production URL in Netlify                                                                                             |
| [Netlify - Redeploy Published to Production](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=448)   | Manual    | Allows teams to re-deploy a previous commit of main to production, in the case of an environment variable changing but the team don't want the most recent build of main to be published.                       |
| [Netlify - Unset Branch Environment Variables](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=449) | Manual    | Cleans up branch specific environment variables created in the 'Branch to environment' pipeline. Applies mostly to MHPD where the production deploy isn't the main branch.                                      |
| [Netlify - Publish Build](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=500)                      | Manual    | Publishes a specific build for an app to production, records deployment information which is surfaced on the [maps-publish-record](https://maps-publish-record.netlify.app/) app.                               |

### PR secret scanning

The PR review pipeline runs [TruffleHog](../netlify/steps/secrets-scan.yml) against the checked-out Git history with `--results=verified`. Only credentials confirmed active by the provider API are included in the report and block the pipeline.

Unverified, unknown (verification could not complete) and normally filtered candidates are excluded. Fake, revoked or example credentials are not expected to fail the pipeline. A clean report means no verified, active credentials were found, not that every candidate was successfully verified.

The pipeline creates a markdown summary, comments on the PR when findings exist, and then fails the secrets scan job. It publishes `trufflehog.sarif` in the `CodeAnalysisLogs` artifact even when findings fail the job.

TruffleHog is detector-based, not a generic password search. Values that do not produce a detector candidate, including some placeholders and known example credentials, will not be reported.

To inspect candidate detection locally without contacting provider APIs or displaying credential values:

```bash
set -o pipefail
trufflehog filesystem README.md --no-verification --no-update \
  --results=verified,unverified,unknown,filtered_unverified --sarif |
  jq '[.runs[].results[] | {detector: .ruleId, level: .level, locations: .locations}]'
```

This diagnostic command deliberately includes all candidate categories; it does not use the pipeline's verified-only policy. With `--no-verification`, candidates cannot be confirmed active. It does not test provider verification or the Azure pipeline integration. Do not add real credentials to the repository for testing.

### Netlify - Deploy to Environment Parameters

| Parameter Name               | Default            | Description                                                                                                    |
| ---------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Branch/tag                   | main               | The branch or tag to deploy                                                                                    |
| App to deploy                | pensions-dashbaord | The application to deploy. Available options; All available applications.                                      |
| Environment                  | test               | Available options; test, staging or custom                                                                     |
| Custom Environment           |                    | for use when 'custom' environment is specified                                                                 |
| Environment variables        | Match environment  | Which set of environment variables to use. Available options; Match environment, deploy-preview, test, staging |
| Custom environment variables |                    | Comma-separated list (Key1=Value1, Key2=Value2)                                                                |
| Run e2e tests                | false              | Whether to run E2E tests for the selected app                                                                  |

### Netlify - Branch to Environment Parameters

| Parameter Name             | Default            | Description                                                                                                                          |
| -------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Branch/tag                 | main               | The branch or tag to deploy                                                                                                          |
| App to deploy              | pensions-dashbaord | The application to deploy. Available options; All available applications.                                                            |
| Copy Environment Variables | deploy-preview     | Which set of environment variables to use. Available options; deploy-preview, branch-deploy, branch:test, branch:staging, production |

### Netlify - Redeploy Published to Production Parameters

| Parameter Name            | Default            | Description                                                                                                       |
| ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| App to deploy             | pensions-dashbaord | The application to deploy. Available options; All available applications.                                         |
| Override Commit Reference |                    | If empty will use the last published commit for the selected app. Otherwise requires full commit reference / hash |

### Netlify - Unset Branch Environment Variables Parameters

| Parameter Name | Default            | Description                                                                             |
| -------------- | ------------------ | --------------------------------------------------------------------------------------- |
| App to deploy  | pensions-dashbaord | The application to deploy. Available options; All available applications.               |
| Branch Name    |                    | The name of the unused branch that was deployed to clear the environment variables for. |

### Netlify - Publish Build (Production)

| Parameter Name                                              | Default  | Description                                                                                                                                    |
| ----------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| App to deploy                                               |          | The application to deploy                                                                                                                      |
| Build ID to publish                                         |          | The ID of the build to publish, available on the Netlify UI                                                                                    |
| JIRA Area (optional)                                        | mapswiki | The JIRA space the associated change request exists                                                                                            |
| JIRA Change ID (optional)                                   |          | The JIRA change request ID                                                                                                                     |
| Release Version (optional)                                  |          | The version if applicable, eg v1.2.3                                                                                                           |
| Custom comment to add to JIRA issue (optional)              |          | A comment which will be added to the JIRA change ID if provided                                                                                |
| Existing deploy (skip publish step)                         | false    | Set to true if the build was already published in the Netlify UI                                                                               |
| Change Failure (Rollback, Hotfix, Patch, Incident Response) | false    | Set to true if change is the result of a rollback, hotfix, patch or indicent response, contributes toward the CFR (Change Failure Rate) metric |

## Support Pipelines

Support pipelines offer additional functionality outside of deployments:

| Pipeline name                                                                                                                               | Parameters                                                 | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Netlify - Add e2e environment variables](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=567)     | App name, Environment variables (A=1;B=2;C=3)              | Adds environment variables to the [netlify-e2e-env-vars](https://portal.azure.com/#@mapsorg.onmicrosoft.com/resource/subscriptions/3a9bae85-2f6e-47a1-a371-7ee3c84cf70b/resourceGroups/Netlify-RG/providers/Microsoft.KeyVault/vaults/netlify-e2e-env-vars/secrets) keyvault, which are used in the e2e tests in the CI pipelines. |
| [Netlify - Backup All Environment Variables](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=451)  | None                                                       | Backs up environment variables for all apps and contexts to the [maps-apps-var-backup](https://portal.azure.com/#@mapsorg.onmicrosoft.com/resource/subscriptions/3a9bae85-2f6e-47a1-a371-7ee3c84cf70b/resourceGroups/netlify-env-var-backup/providers/Microsoft.KeyVault/vaults/maps-apps-var-backup/overview) keyvault.           |
| [Netlify - Restore App Environment Variables](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=452) | App to Deploy, Context                                     | Restores the backed up environment variables for a specific app and context.                                                                                                                                                                                                                                                       |
| [Netlify - Fix Build Error](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=479)                   | None                                                       | Fixes all app builds in Netlify after updating a package causes build errors, re-triggers all contexts using a clear cache.                                                                                                                                                                                                        |
| [Netlify - Update Environment Variable(s)](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=566)    | App, Environment variable name, Environment variable value | Update a single environment variable in Netlify for one or all apps, main purpose is to toggle the FORCE_BUILD value for all apps but will work for any environment variable                                                                                                                                                       |
