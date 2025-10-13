# Maps Digital - NX Monorepo

This repository contains the source code for the frontend applications of the Money and Pensions Service (MaPS). This is an [Nx](https://nx.dev) monorepo containing multiple Next.js applications and shared libraries.

## Applications

This repository includes the following applications:

- **Adjustable income calculator** - Tool for calculating adjustable income scenarios
- **Baby cost calculator** - Tool for planning costs for having a baby
- **Baby money timeline** - Timeline of events leading up to the arrival of a baby
- **Budget planner** - Comprehensive budgeting tool for financial planning
- **Cash in chunks** - Pension withdrawal calculator
- **Compare accounts (PACs)** - Tool for comparing different account options
- **Credit options** - Credit comparison and advice tool
- **Credit rejection** - Support for credit rejection scenarios
- **Debt advice locator** - Service to find local debt advice
- **Evidence hub** - Evidence based documentation and reports
- **Guaranteed income estimator** - Pension income estimation tool
- **Leave pot untouched** - Pension pot preservation calculator
- **Midlife MOT** - Financial health check tool
- **Money adviser network** - Directory of financial advisers
- **Moneyhelper contact forms** - Various contact and enquiry forms
- **Moneyhelper tools** - Collection of financial tools and calculators
- **Mortgage affordability** - Mortgage affordability calculator
- **Mortgage calculator** - Mortgage payment calculator
- **Pensions dashboard (MHPD)** - Unified pensions overview
- **Pensionwise appointment** - Appointment booking system
- **Pensionwise triage** - Pension guidance triage system
- **Redundancy pay calculator** - Calculate redundancy payments
- **Retirement budget planner** - Tool for planning how much you may need in retirement
- **Savings calculator** - Tool to calculate how long/much to save to hit a goal
- **Stamp duty calculator** - Property stamp duty calculator
- **Standard financial statement** - Financial statement tool
- **Take whole pot** - Pension withdrawal calculator
- **Tools index** - Landing page for all tools

Each application has its own README in its respective directory under `/apps/` with specific setup and usage instructions.

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm

### Installation

1. Clone this repository from Azure DevOps
2. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Each application requires environment variables to run properly, you can either have a root level .env.local file, or an app specific file:

1. Navigate to the specific app directory (e.g., `/apps/budget-planner/`)
2. Copy the `.env.example` file and rename it to `.env.local`
3. Ask an existing team member for the correct values to populate the `.env.local` file

## Development

### Running Applications

It is recommended to use the [Nx Console extension](https://nx.dev/nx-console) to run app scripts (starting, linting, testing, etc.). The plugin provides an easy-to-use interface for managing and executing various tasks within your workspace.

**Using Nx Console (Recommended):**

- Install the Nx Console VS Code extension
- Use the sidebar panel to run tasks for specific applications
- View and execute build, serve, test, and lint commands through the UI

**Command Line:**

```bash
# Start a specific application
npm run serve <app_name>
# Example: npm run serve pensionwise-triage

# Use nx directly
npx nx serve <app_name>

# Or run Netlify dev (config in apps/<app_name>/netlify.toml)
# Runs locally with Netlify's proxy and redirect rules
netlify dev --filter <app_name>
```

Open your browser and navigate to the URL returned in the terminal (typically `http://localhost:4200` or similar).

### Building Applications

```bash
# Build a specific application
npx nx build <app_name>

# Build all applications
npx nx run-many --target=build --all

# Build only affected applications
npx nx affected --target=build
```

## NX Workspace Management

### Creating New Applications

To generate a new Next.js application:

```bash
# Create app directory first
mkdir apps/example-app

# Generate the application
npx nx generate @nx/next:application example-app --directory=apps/example-app
```

**Configuration Options:**

- E2E test runner: Cypress/Playwright
- Use App Router: No
- Use `src/` directory: No
- Project name: Derived from directory

After generation, configure the `project.json` file using existing apps as examples to maintain consistency.

### Creating Libraries

```bash
# Generate a shared library
npx nx generate @nx/react:library shared/ui
```

**Configuration Options:**

- Default stylesheet format: SCSS
- Use App Router: No

### Setting Up Tailwind CSS

For each new application:

```bash
# Set up Tailwind for the app
npx nx g @nx/react:setup-tailwind --project=example-app
```

Add the workspace preset to the app's `tailwind.config.js`:

```javascript
module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  // ...other config
};
```

### Setting Up Storybook

```bash
# Install Storybook dependency
npm add --dev @nx/storybook

# Generate Storybook configuration
npx nx generate @nx/storybook:configuration shared-ui
```

### E2E Test Structure

E2E applications are organized in a common folder to prevent clutter:

```
├── apps
│   ├── e2e
│   │   ├── app-name-e2e
│   │   └── ...
│   ├── app-name
│   └── ...
```

Ensure E2E project.json has `"projectType": "application"` for proper NX detection.

## Testing

### Unit Tests

```bash
# Run all tests
npm run test:all

# Run tests for specific app
npx nx test <app_name>

# Run affected tests only
npx nx affected --target=test
```

### Jest ESM Support for slug

Some dependencies, such as [`slug`](https://github.com/Trott/slug), are distributed as ESM-only modules. By default, Jest does not transform ESM code in `node_modules`, which can cause test failures when importing these packages.

To resolve this, the following configuration has been added to the shared Jest preset (`jest.preset.js`):

```javascript
// jest.preset.js
module.exports = {
  // ...other preset config
  transformIgnorePatterns: [
    // Allow Jest to transform slug ESM
    'node_modules/(?!(slug)/)',
  ],
};
```

This ensures Jest can correctly process ESM code from `slug` and prevents unexpected token errors during test runs.  
All Jest configs in the workspace import this preset, so the change is applied globally.

### End-to-End Tests

**Local Testing:**

```bash
# Pensionwise Triage
npm run test:e2e pensionwise-triage-e2e

# Pensionwise Appointment
npm run test:e2e pensionwise-appointment-e2e

# Pensions Dashboard
npm run test:e2e pensions-dashboard-e2e
```

**Environment Testing:**

```bash
# Test against dev environment
npm run test:e2e pensionwise-triage-e2e -- --baseUrl=https://dev-pwtriage.moneyhelper.org.uk/en/pension-wise-triage/

npm run test:e2e pensionwise-appointment-e2e -- --baseUrl=https://dev-pwappt.moneyhelper.org.uk/en/pension-wise-appointment/
```

**MoneyHelper Tools E2E Tests:**

```bash
npm run test:e2e moneyhelper-tools-adjustable-income-e2e
npm run test:e2e baby-cost-calculator-e2e
npm run test:e2e baby-money-timeline-e2e
npm run test:e2e budget-planner-e2e
npm run test:e2e moneyhelper-tools-cash-in-chunks-e2e
npm run test:e2e moneyhelper-tools-guaranteed-income-estimator-e2e
npm run test:e2e moneyhelper-tools-pension-type-e2e
npm run test:e2e moneyhelper-tools-pot-estimator-e2e
npm run test:e2e moneyhelper-tools-pot-untouched-e2e
npm run test:e2e savings-calculator-e2e
npm run test:e2e moneyhelper-tools-workplace-pension-calculator-e2e
```

## Storybook

```bash
# Run Storybook locally
npm run storybook
```

Open your browser and navigate to <http://localhost:4400/>

**Production Storybook:**
When a pull request is merged to main, Storybook is automatically deployed and can be viewed at:
<https://main--65c4bdbe9bcdf2e1145a3b6a.chromatic.com>

### Adding Figma Design Links to Stories

```javascript
// Add to all story variations
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

// Add to specific story variant
export const Primary = Template.bind({});
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://different-link-to-figma-url',
  },
};
```

## Development Tools & Component Generation

### Generate UI Components

There is a custom generator that creates components following the [Frontend Best Practices](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices):

**Via NX Console (Recommended):**

- Select `generate` → `@maps-react/tools - component`

**Via CLI:**

```bash
npm nx generate @maps-react/tools:component
```

**Generated Structure:**

```bash
└── libs/shared/ui/src/components
  └── ComponentName
    ├── ComponentName.stories.tsx
    ├── ComponentName.test.tsx
    ├── ComponentName.tsx
    └── index.ts
```

Use `targetPath` option to create components in specific directories (e.g., `apps/pensionwise-triage/components`).

## Code Quality & Standards

### Linting

```bash
# Lint specific app
npx nx lint <app_name>

# Lint all projects
npx nx run-many --target=lint --all

# Lint affected projects only
npx nx affected --target=lint
```

### Code Analysis with SonarQube

Instructions for SonarQube setup and configuration can be found in `sonarqube/README.md`.

## Deployment & CI/CD

### Pipeline Overview

- **content-synch.yml** - Content synchronization with AEM
- **github-synch.yml** - Push code from this repo to GitHub repository
- **dependabot-pipeline.yml** - Weekly dependency and vulnerability checks

| Pipeline Name                                                                                                                                | Trigger   | Description                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Netlify - PR Review](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=359)                          | PR        | Runs code analysis and e2e tests in parallel to netlify creating deploy previews                                                                                                              |
| [Netlify - Develop on Merge](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=354)                  | PR Merged | Runs e2e tests on affected apps, resets develop with main and commits, netlify builds dev environment for affected apps (develop--<app_name>.netlify.app)                                     |
| [Netlify - Deploy to Environment](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=352)              | Manual    | Deploys specific app and branch (usually main) to test or staging (e2e tests optional, enabled via pipeline parameter, urls test--<app_name>.netlify.app and staging--<app_name>.netlify.app) |
| [Netlify - Branch to Environment](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=447)              | Manual    | Allows teams to create a production build of a branch, which can then be published to the production URL in Netlify                                                                           |
| [Netlify - Redeploy Published to Production](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=448)   | Manual    | Allows teams to re-deploy a previous commit of main to production, in the case of an environment variable changing but the team don't want the most recent build of main to be published.     |
| [Netlify - Unset Branch Environment Variables](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_build?definitionId=449) | Manual    | Cleans up branch specific environment variables created in the 'Branch to environment' pipeline. Applies mostly to MHPD where the production deploy isn't the main branch.                    |

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

### Production Deployment

Production deployments are managed through the Netlify UI:

1. Visit the deploy list for your app (e.g., [Mortgage Calculator Deploys](https://app.netlify.com/projects/mh-mortgage-calculator/deploys))
2. Filter by branch (enter "main") and status ("Successful")
3. Adjust time frame to find the target build
4. Verify the commit reference matches your expected deployment
5. Click "Publish deploy" to deploy to production

## Workspace Maintenance

### NX Migration

```bash
# Create migrations file for latest version
npm nx migrate latest

# Or migrate to specific version
npm nx migrate [version]

# Run the migrations
npm nx migrate --run-migrations

# Install updated dependencies
npm install
```

**Post-Migration Testing:**

- Run unit tests
- Run E2E tests
- Test component generation with `nx generate`
- Test apps in local environment
- Build and test all applications

### Local MoneyHelper Build

```bash
# Build the project
npx nx build moneyhelper-tools

# Navigate to build directory
cd dist/apps/moneyhelper-tools

# Run the build
npm start
```

## VS Code Workspace Setup

### Recommended Extensions

The following extensions provide useful features and improve productivity. Install them for the best development experience:

#### Workspace Specific (Required)

1. **Prettier (`esbenp.prettier-vscode`)** - Automatically formats code to maintain consistent style
2. **ESLint (`dbaeumer.vscode-eslint`)** - Ensures code adheres to industry standards and catches errors early
3. **Headwind (`heybourn.headwind`)** - Sorts Tailwind CSS classes automatically

#### Team-Specific (Recommended)

1. **Nx Console (`nrwl.angular-console`)** - Provides UI for NX CLI, making it easier to generate components and run tasks
2. **Conventional Commits (`vivaxy.vscode-conventional-commits`)** - Helps write [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/)

#### Development Tools (Optional)

1. **Wallaby.js (`WallabyJs.wallaby-vscode`)** - Real-time code coverage and test results
2. **Jest Runner (`firsttris.vscode-jest-runner`)** - Run and debug Jest tests directly from editor
3. **Better Comments (`aaron-bond.better-comments`)** - Enhanced code comments with colors and styles
4. **TODO Tree (`Gruntfuggly.todo-tree`)** - Highlights TODO comments and provides overview
5. **Tailwind Docs (`austenc.tailwind-docs`)** - Quick access to Tailwind CSS documentation
6. **Figma (`figma.figma-vscode-extension`)** - View and inspect Figma designs in VS Code
7. **Peacock (`johnpapa.vscode-peacock`)** - Customize workspace color for easy project identification

Filter extensions with **@recommended** to display workspace recommendations.

### Peacock Setup

To avoid committing changes to `.vscode/settings.json`:

1. Right-click the changed file and select "Skip Worktree", or
2. Manually add `/.vscode/settings.json` to `.git/info/exclude`

## Project Structure

```
├── apps/                          # Applications
│   ├── [app-name]/               # Individual Next.js applications
│   └── e2e/                      # End-to-end test applications
├── libs/                         # Shared libraries
│   └── shared/
│       └── ui/                   # Shared UI components
├── tools/                        # Custom NX generators and tools
├── netlify/                      # Netlify deployment configurations
├── sonarqube/                    # SonarQube analysis configuration
├── nx.json                       # NX workspace configuration
├── package.json                  # Root dependencies and scripts
└── tsconfig.base.json           # Base TypeScript configuration
```

## Best Practices

### Naming Conventions

- **Apps**: Use maximum 2 separators (e.g., `cash-in-chunks`, not `cash-in-chunks-calculator`)
- **Components**: PascalCase for component names
- **Files**: kebab-case for file names
- **Pipelines**: Follow `{resource}-{action}.yml` format

### Development Guidelines

- Follow the [Frontend Best Practices](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices)
- Use conventional commit messages for better semantic versioning
- Ensure each pipeline achieves one goal, not many
- Document pipeline behavior in this README
- Test thoroughly after NX migrations

### Code Organization

- Keep E2E tests in the dedicated `/apps/e2e/` folder
- Use shared libraries for common functionality
- Maintain consistent project.json configuration across apps
- Follow the established Tailwind configuration pattern

## Getting Help

- Consult individual app READMEs for specific application details
- Review the [NX documentation](https://nx.dev) for workspace management
- Check the [Frontend Best Practices wiki](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices) for coding standards
- Ask team members for environment variable values and specific configuration details

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the established patterns
3. Ensure all tests pass
4. Create a pull request with a descriptive title and conventional commit messages
5. Code will be reviewed and E2E tests will run automatically
6. After approval and merge, changes will be deployed to the development environment

---

For application-specific information, please refer to the README in each app's directory under `/apps/`.
