# Maps Digital

This workspace was generated using [Nx](https://nx.dev)
To see how it was set up take a look at the SETUP.md file

## Getting started

Clone this repo from Azure
Install dependencies - run `npm install`

## Environment variables

In order to run the apps you will need to copy and rename the .env.example file as .env.local in the app you want to run.

Ask an existing member of the team for the values to place in the .env.local file.

## Starting the apps

To start the pensionwise triage app run `npm run serve pensionwise-triage`
Open your browser and navigate to http://localhost:4200/

To start the pensionwise appointment app run `npm run serve pensionwise-appointment`
Open your browser and navigate to http://localhost:4250/

To start the moneyhelper tools app run `npm run serve moneyhelper-tools`
Open your browser and navigate to http://localhost:4300/

## Jest unit tests

To run jest tests for all apps and libs `npm run test:all`

## Storybook

To run the storybook `npm run storybook`
Open your browser and navigate to http://localhost:4400/

When a PR is merged Storybook is deployed as part of the pipeline and can be viewed here:
https://main--65c4bdbe9bcdf2e1145a3b6a.chromatic.com

## Useful commands

### Generate a component in the shared ui library

There is a custom generator that will create a component, test & storybook foloowing the [FrontEnd Best Practices](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices)

Either via the NX console select `generate` and then `@maps-digital/tools - component`

Or, directly using the NX cli.

`npm nx generate @maps-digital/tools:component`

This will output a folder structure like below, using the component name entered for the fileName, ComponentName etc.

```bash
└── libs/shared/ui/src/libs/components
  └── ComponentName
    ├── ComponentName.stories.tsx
    ├── ComponentName.test.tsx
    ├── ComponentName.tsx
    └── index.ts
```

optionaly, supplying a `targetPath` will all creation of a component in any directory (eg, apps/pensionwise-triage/components)

## Migrate NX to a later version

Create a migrations json file `yarn nx migrate latest` or `yarn nx migrate [version]`

Run the migration based on the generated migrations file `yarn nx migrate --run-migrations`

Install new version `npm install`

You should now thoroughly test the application including:

- Unit tests
- E2E tests
- Creating a component in the shared UI library using the nx generate command
- Test the apps on your local environment
- Build the apps and test them

## Editor Integration

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Running triage tests

To run the triage test locally `npm run test:e2e pensionwise-triage-e2e`
To run the triage test on dev env `npm run test:e2e pensionwise-triage-e2e -- --baseUrl=https://dev-pwtriage.moneyhelper.org.uk/en/pension-wise-triage/`

## Running appointment tests

To run the appointment test locally `npm run test:e2e pensionwise-appointment-e2e`
To run the appointment test on dev env `npm run test:e2e pensionwise-appointment-e2e -- --baseUrl=https://dev-pwappt.moneyhelper.org.uk/en/pension-wise-appointment/`

## Running moneyhelper tests

To run the moneyhelper test locally `npm run test:e2e moneyhelper-tools-e2e`

## Creating a Sonarqube report

Instructions on how to install, configure and run Sonar can be found in the `sonarqube/README.md` file.
