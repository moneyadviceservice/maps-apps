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

## Commit Markers

### Description

Upon creation of a PR, any apps that have changed in the source branch will have e2e tests and sonar scans run against them.
In certain scenarios, we may want E2E tests or Sonar Scans to run against all apps in the monorepo, even for PR's where these
apps have not changed. For example, upon changing SonarCloud configuration files, we may want to trigger Sonar Scans for every app
to verify this isn't a breaking change, without having to manually change every app.

### Usage

To trigger these test runs in the PR, add a marker to the end of your commit message for the _most recent commit_ for your PR.
Either add the marker to your last commit, or you can add an empty commit before creating the PR once all work is done on the branch.

```bash
# Empty commit message which triggers Sonar Scans for every app
git commit -m "Run sonar scans for all apps in this PR [run-all-sonar]" --allow-empty

# Commit message which triggers E2E tests for every app
git commit -m "Run all e2e tests for this PR [run-all-e2e]"

# Commit message which triggers both E2E and Sonar Scans for every app
git commit -m "Run all apps for this PR [run-all-e2e] [run-all-sonar]" --allow-empty
```
