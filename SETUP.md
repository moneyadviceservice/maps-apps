# MapsDigital NX Workspace Setup

This document explains how to set up the developer environment for the current applications,
and how to create new applications, libraries and generators.

## To generate a new NX app

- Add folder in apps directory `apps/example-app`

`npx nx generate @nx/next:application example-app --directory=apps/example-app`

> Options:

- Which E2E test runner would you like to use? Cypress/Playwright
- Use App Router: No
- Would you like to use `src/` directory? No
- What should be the project name and where should it be generated? Derived (otherwise it will empty the contents into the apps directory)

You will then need to configure the project.json in the added app directory to keep consistency with the other apps in the monorepo. (Use other app project.json files as an example)

## Test app setup

Make sure the E2E app project json has the correct application type set `"projectType": "application"` otherwise the default is "lib" and that means the NX command `npx nx show projects --type e2e` doesn't pick up the correctly affected e2e apps.

### Move all E2E apps into a common folder.

To prevent the apps folder becoming cluttered, we colocate the E2E app in a sub-folder within apps.

```
├── apps
│   ├── e2e
│   │   ├── money-advice-network-e2e
│   │   ├── pensions-dashboard-e2e
│   │   ├── tools-baby-costs-calculator-e2e
│   │   ├── tools-guaranteed-income-e2e
│   │   ├── example-app-e2e
│   │   └── etc
│   ├── money-advice-network
│   ├── pensions-dashboard
│   ├── moneyhelper-tools
│   ├── example-app
│   └── etc
```

### Update the configuration

Ensure all paths are correct (eg relative paths to base tsconfig, and ensure the project json targets include the new `/e2e` folder).

```
├── example-app-e2e
│   ├── .eslintrc.json
│   ├── project.json
│   └── tsconfig.json
└── ...
```

### Add the test task to the pipeline

Duplicate one of the existing jobs in `/templates/jobs/test.yml` and update to reflect the new E2E app.

```yml
- job: test_new_app_if_affected
  displayName: 'example-app-e2e'
  condition: and(succeeded(), contains(stageDependencies.Build.Determine_Affected.outputs['determinenxaffected.envstodeploy'], 'example-app'))
  steps:
    - template: ../steps/4-run-tests.yml
      parameters:
        compareWithTargetBranch: ${{ parameters.compareWithTargetBranch }}
        envstodeploy: example-app-e2e
        AKS_SPN_ID: $(AKS_SPN_ID)
        AKS_SPN_KEY: $(AKS_SPN_KEY)
        TENANT_ID: $(TENANT_ID)
        acrName: newapp
        environment: review
```

## Generate a library

`npx nx generate @nx/react:library shared/ui`

> Options:

- Default stylesheet format: SCSS
- Use App Router: No

## Set up tailwind

For each app run the set up for tailwind
`npx nx g @nx/react:setup-tailwind --project=example-app`

Copy the contents of tailwind.config.js file from current moneyhelper tools into a global
`tailwind-workspace-preset.js` file

Add this line to the module.exports section of each apps tailwind.config.js file
`presets: [require('../../tailwind-workspace-preset.js')],`

This allows us to share the tailwind config between apps.

## Set up storybook

Install storybook dependency
`npx add --dev @nx/storybook`

Generate storybook config
`npx nx generate @nx/storybook:configuration shared-ui`

> Options:

- Configure a cypress e2e app: No
- Storybook framework: NextJS

### To add a Figma design link to a Story

Here we will use the Button component story as an example.

You can add the design link to the StoryProps to add the link to all variations.

```
const StoryProps = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://link-to-figma-url',
    },
  },
};
```

You can also add a link to a specific variant in a story.

```
export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary',
};
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://different-link-to-figma-url',
  },
};
```
