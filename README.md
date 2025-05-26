# Maps Digital

This repository contains the source code for the frontend applications of the Money and Pensions Service (MaPS). Including:

- MoneyHelper Tools
- Pensions Dashboard
- Pensionwise Appointment
- Pensionwise Triage
- Budget planner
- Cash in Chunks
- Compare Accounts
- Credit Rejection
- Debt Advice Locator
- Guaranteed Income Estimator
- Money Advice Network
- Mortgage Calculator
- Standard Financial Statement
- Take Whole Pot
- Redundancy Pay Calculator

## Workspace

This workspace was generated using [Nx](https://nx.dev)
To see how it was set up take a look at the SETUP.md file

## Getting started

Clone this repo from Azure DevOps
Install dependencies - run `npm install`

## Environment variables

In order to run the apps you will need to copy and rename the `.env.example` file as `.env.local` in the app you want to run.

Ask an existing member of the team for the values to place in the `.env.local` file.

## Starting the apps

It is recommended to use the [Nx Console extensions](https://nx.dev/nx-console) to run app scripts (starting, linting, testing, etc.). The plugin provides an easy-to-use interface for managing and executing various tasks within your workspace.

For legacy purposes, you can still use the following commands to start the apps:

To start the pensionwise triage app run `npm run serve pensionwise-triage`
Open your browser and navigate to <http://localhost:4200/>

To start the pensionwise appointment app run `npm run serve pensionwise-appointment`
Open your browser and navigate to <http://localhost:4250/>

To start the moneyhelper tools app run `npm run serve moneyhelper-tools`
Open your browser and navigate to <http://localhost:4300/>

To start the pensions-dashboard app run `npm run serve pensions-dashboard`
Open your browser and navigate to <http://localhost:4100/>

To start the budget-planner app run `npm run serve budget-planner`
Open your browser and navigate to <http://localhost:4350/>

To start the compare-accounts app run `npm run serve compare-accounts`
Open your browser and navigate to <http://localhost:4337/>

To start the credit-rejection app run `npm run serve credit-rejection`
Open your browser and navigate to <http://localhost:4350/>

To start the mortgage-calculator app run `npm run serve mortgage-calculator`
Open your browser and navigate to <http://localhost:4390/>

To start the redundancy-pay-calculator app run `npm run serve redundancy-pay-calculator`
Open your browser and navigate to <http://localhost:4395/>

## Jest unit tests

To run Jest tests for all apps and libs `npm run test:all`

## Storybook

To run the storybook `npm run storybook`
Open your browser and navigate to <http://localhost:4400/>

When a pull request is merged to main, Storybook is deployed as part of the pipeline and can be viewed here:
<https://main--65c4bdbe9bcdf2e1145a3b6a.chromatic.com>

## Plugins

### Recommended

The following recommend plugins provide useful features and integrations that help streamline workflow and improve productivity. Split into 3 sections. For more details, refer to the `.vscode/extensions.json` file.

Filtering extensions with **@recommended** will display the following list of plugins under **WORKSPACE RECOMMENDATIONS**.

#### Workspace Specific (required)

1. **Prettier (`esbenp.prettier-vscode`)**: Automatically formats code to maintain a consistent style across the mono-repo, reducing the need for manual formatting.
2. **ESLint (`dbaeumer.vscode-eslint`)**: Ensures code adheres to a an industry standards style and catches potential errors early.
3. **Headwind (`heybourn.headwind`)**: Sorts Tailwind CSS classes automatically, ensuring a consistent order.

#### Team-Specific (recommended)

1. **Nx Console (`nrwl.angular-console`)**: Provides a UI for the React CLI, making it easier to generate components, services, as well as run project.json tasks (build/test etc).
2. **Conventional Commits (`vivaxy.vscode-conventional-commits`)**: Helps you write [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/), which are useful for semantic versioning and changelog generation.

#### Development Tools (optional)

1. **Wallaby.js (`WallabyJs.wallaby-vscode`)**: Provides real-time code coverage and test results directly in the editor, helping with writin / debuging tests.
2. **Jest Runner (`firsttris.vscode-jest-runner`)**: Allows running and debuging of Jest tests directly from the editor.
3. **Better Comments (`aaron-bond.better-comments`)**: Enhances code comments with different colors and styles, making them more readable and useful.
4. **TODO Tree (`Gruntfuggly.todo-tree`)**: Highlights TODO comments in the code and provides an overview of all TODOs in your project in the sidebar.
5. **Tailwind Docs (`austenc.tailwind-docs`)**: Provides quick access to the Tailwind CSS documentation, making it easier to reference classes and utilities.
6. **Figma (`figma.figma-vscode-extension`)**: Integrates Figma with VS Code, allowing you to view and inspect Figma designs directly in your editor.
7. **Peacock (`johnpapa.vscode-peacock`)**:Customise the project workspace colour, handy when working on multiple projects to easily identify which project you are in visually by colour.

## Useful commands

### Generate a component in the shared UI library

There is a custom generator that will create a component, test & Storybook following the [Frontend Best Practices](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices)

This can be done either via the NX console:
select `generate` and then `@maps-react/tools - component`

Or, directly using the NX cli:
`npm nx generate @maps-react/tools:component`

This will output a folder structure like below, using the component name entered for the fileName, ComponentName etc.

```bash
└── libs/shared/ui/src/components
  └── ComponentName
    ├── ComponentName.stories.tsx
    ├── ComponentName.test.tsx
    ├── ComponentName.tsx
    └── index.ts
```

optionaly, supplying a `targetPath` will all creation of a component in any directory (eg, apps/pensionwise-triage/components)

## Migrate NX to a later version

Create a migrations JSON file `yarn nx migrate latest` or `yarn nx migrate [version]`

Run the migration based on the generated migrations file `yarn nx migrate --run-migrations`

Install new version `npm install`

You should now thoroughly test the application including:

- Unit tests
- E2E tests
- Create a component in the shared UI library using the `nx generate` command
- Test the apps on your local environment
- Build the apps and test them

## Running triage tests

To run the triage test locally `npm run test:e2e pensionwise-triage-e2e`
To run the triage test on dev env `npm run test:e2e pensionwise-triage-e2e -- --baseUrl=https://dev-pwtriage.moneyhelper.org.uk/en/pension-wise-triage/`

## Running appointment tests

To run the appointment test locally `npm run test:e2e pensionwise-appointment-e2e`
To run the appointment test on dev env `npm run test:e2e pensionwise-appointment-e2e -- --baseUrl=https://dev-pwappt.moneyhelper.org.uk/en/pension-wise-appointment/`

## Running moneyhelper tests

To run each moneyhelper app test indivudally locally run ...

1. `npm run test:e2e moneyhelper-tools-adjustable-income-e2e`
2. `npm run test:e2e moneyhelper-tools-baby-costs-calculator-e2e`
3. `npm run test:e2e moneyhelper-tools-cash-in-chunks-e2e`
4. `npm run test:e2e moneyhelper-tools-guaranteed-income-e2e`
5. `npm run test:e2e moneyhelper-tools-mortgage-affordability-calculator-e2e`
6. `npm run test:e2e moneyhelper-tools-pension-type-e2e`
7. `npm run test:e2e moneyhelper-tools-pot-estimator-e2e`
8. `npm run test:e2e moneyhelper-tools-pot-untouched-e2e`
9. `npm run test:e2e moneyhelper-tools-savings-calculator-e2e`
10. `npm run test:e2e moneyhelper-tools-workplace-pension-calculator-e2e`
11. `npm run test:e2e moneyhelper-tools-budget-planner-e2e`
12. `npm run test:e2e moneyhelper-tools-compare-accounts-e2e`
13. `npm run test:e2e moneyhelper-tools-credit-rejection-e2e`
14. `npm run test:e2e moneyhelper-tools-baby-money-timeline-e2e`
15. `npm run test:e2e mortgage-calculator-e2e`
16. `npm run test:e2e redundancy-pay-calculator-e2e`

## Running moneyhelper build locally

build project `nx build moneyhelper-tools`
change directory to build `cd dist/apps/moneyhelper-tools`
run build `npm start`

## Running pensions-dashboard tests

To run the moneyhelper test locally `npm run test:e2e pensions-dashboard-e2e`

## Creating a Sonarqube report

Instructions on how to install, configure and run Sonar can be found in the `sonarqube/README.md` file.

## Pipelines

- acr-cleanup.yml
  - Clean up ACR Images older than 30 days
- ephemeral-app-cleanup.yml
  - Clean up App Services spun up for pull requests after merging to main, and on Fridays at 8, whichever is the soonest
- content-synch.yml
  - Content synchronization with AEM
- github-synch.yml
  - Push code from this repo to a repo in GitHub
- dependabot-pipeline.yml
  - Weekly dependency check
- owasp-dep-check-pipeline.yml
  - Weekly dependency vulnerability check
- azure-pipelines.yml
  - Build the ephemeral PR App Service
- build-deploy-after-merge.yml
  - Build and deploy affected applications to dev
- tag-and-promote-from-dev.yml
  - Deployment of applications to Dev and Test
- promote-to-higher-env.yml
  - Deployment of applications to Staging and Production

#### Creating new pipelines

Where possible, pipelines should follow the naming convention `{resource}-{action}.yml`.
Pipelines should achieve one goal, not many.
Pipeline behaviour should be documented here.

## Extensions setup

#### (7) Peacock

The `.vscode/settings.json` file cannot be added to `.gitignore` because we already have settings committed.

So to avoid having to leave the file in source control changed you can

1. ignore it locally by right click the changed file and selecting "Skip Worktree"" or
2. manually add `/.vscode/settings.json` to the `.git/info/exclude` file.

#### Useful information

Make your app name only have 2 separators max e.g cash-in-chunks and NOT cash-in-chunks-calculator
