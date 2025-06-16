# Maps Digital

This repository contains the source code for the frontend applications of the Money and Pensions Service (MaPS). Including:

- Adjustable income calculator
- Budget planner
- Cash in chunks
- Compare accounts (PACs)
- Credit options
- Credit rejection
- Debt advice locator
- Guaranteed income estimator
- Leave pot untouched
- Money adviser network
- Moneyhelper contact forms
- Moneyhelper tools
- Mortgage affordability
- Mortgage calculator
- Pensions dashboard (MHPD)
- Pensionwise appointment
- Pensionwise triage
- Redundancy pay calculator
- SDLT calculator
- Stamp duty calculator
- Standard financial statement
- Take whole pot
- Tools index

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

To start an app run "npm run serve <app_name>" (eg: `npm run serve pensionwise-triage`)
Open your browser and navigate to the url returned in the terminal.

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

## Running end to end (e2e) tests

To run e2e test locally

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
3. `npm run test:e2e moneyhelper-tools-baby-money-timeline-e2e`
4. `npm run test:e2e moneyhelper-tools-budget-planner-e2e`
5. `npm run test:e2e moneyhelper-tools-cash-in-chunks-e2e`
6. `npm run test:e2e moneyhelper-tools-guaranteed-income-estimator-e2e`
7. `npm run test:e2e moneyhelper-tools-pension-type-e2e`
8. `npm run test:e2e moneyhelper-tools-pot-estimator-e2e`
9. `npm run test:e2e moneyhelper-tools-pot-untouched-e2e`
10. `npm run test:e2e moneyhelper-tools-savings-calculator-e2e`
11. `npm run test:e2e moneyhelper-tools-workplace-pension-calculator-e2e`

## Running moneyhelper build locally

build project `nx build moneyhelper-tools`
change directory to build `cd dist/apps/moneyhelper-tools`
run build `npm start`

## Running pensions-dashboard tests

To run the moneyhelper test locally `npm run test:e2e pensions-dashboard-e2e`

## Creating a Sonarqube report

Instructions on how to install, configure and run Sonar can be found in the `sonarqube/README.md` file.

## Pipelines

- content-synch.yml
  - Content synchronization with AEM
- github-synch.yml
  - Push code from this repo to a repo in GitHub
- dependabot-pipeline.yml
  - Weekly dependency and vulnerability check
- netlify/netlify-pr-review.yml
  - PR code analysis and e2e tests affected apps
- netlify/netlify-azure-pipelines.yml
  - Deploy apps to environments
- netlify/netlify-dev-on-merge
  - Runs when PR merged, resets develop to main, triggering netlify deploy

## Deployment Options (Test, Staging & other pre-production environments)

When running the **'Netlify - Deploy to Environment'** pipeline, there are several options available:

- Branch/tag
  - The branch or tag to deploy
- App to deploy
  - The app to deploy
- Environment
  - test, staging or custom. Custom required when deploying to a custom alias
- Custom Environment
  - If 'custom' selected for 'Environment', specify the custom alias here
- Environment variables
  - Which set of environment variables to use for the build, if 'test' or 'staging' selected for 'Environment' above, then 'Match Environment' will be used by default
  - If 'custom' selected for 'Environment', please choose which environment variables to use for the build.
- Run e2e tests
  - Whether the also run the e2e tests for the selected app

## Deploying to production

Each time a PR is created or merged, a build is created in Netlify. Deploying to production involves publishing the target build in the Netlify UI.

### Tips on finding the right build

You might not want to publish the latest build for your app, instead choosing a specific build. In order to make finding a specific build easier, consider the following:

- Visit the list of deploys for your app, [see example](https://app.netlify.com/projects/mh-mortgage-calculator/deploys)
- If looking for a build of the main branch, enter main into the input search field
- Under the filters section change 'Any status' to 'Successful' filtering the list to only include successful builds
- Update the time frame to include the rough time when your PR was merged (as this would have triggered the build)
- The results will include the latest commit ref of the build (eg main@**b90d4e3**), clicking a build will take you its summary page where you are able to click to commit ref and get taken to it in ADO so you can confirm the latest commit.
- To publish a deploy to production, click on 'Publish deploy'

## Creating new pipelines

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

- Make your app name only have 2 separators max e.g cash-in-chunks and NOT cash-in-chunks-calculator
