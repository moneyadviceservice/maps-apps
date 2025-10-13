# MoneyHelper Contact Forms

A Next.js application for the MoneyHelper Contact Forms, built and maintained by the Money and Pensions Service (MaPS). This app enables users to access and submit contact and enquiry forms for various MoneyHelper services, supporting both English and Welsh languages.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Nx](https://img.shields.io/badge/Nx-Monorepo-143055?logo=nx)](https://nx.dev/)

---

## Table of contents

- [About](#about)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment Variables](#environment-variables)
- [Branch and Backend Environment Mapping](#branch-and-backend-environment-mapping)
- [Testing and Linting](#testing-and-linting)
- [Architecture and Approach](#architecture-and-approach)
- [Contributing](#contributing)

---

## About

MoneyHelper Contact Forms is part of the [maps-apps monorepo](https://github.com/moneyadviceservice/maps-apps), which contains multiple applications for the Money and Pensions Service. This app provides a web interface allowing users to:

- Access and submit contact/enquiry forms for different MoneyHelper services
- Navigate the service in English or Welsh
- Experience a multi-step, accessible, and responsive form journey

The application is built with [Next.js 14](https://nextjs.org/), managed with [Nx](https://nx.dev/), and deployed using [Netlify](https://www.netlify.com/).

---

## Key Features

- 🌐 **Bilingual Support:** Full Welsh and English language support
- 📝 **Multiple Forms:** Enquiry forms flows for various services [routeFlow.ts](./routes/routeFlow.ts)
- ♿ **Accessibility First:** WCAG 2.1 Level AA compliant via [shared-ui](https://main--65c4bdbe9bcdf2e1145a3b6a.chromatic.com/) components
- 🔒 **Secure Submission:** Data validation via [zod](https://zod.dev/) and secure API integration
- 📱 **Responsive Design:**
- 🚀 **Performance Optimized:** Server-side rendering with Next.js for JS and Non-JS browser instances.
- 🔄 **Data Persistence:** Form state recovery and confirmation flows using [shared Redis helpers](../../libs/shared/redis/README.MD)
- 🔗 **Deep-Linking & Auto-Advance:** Supports direct links to any flow via a query parameter, automatically advancing users to the correct step. See [Architecture & Approach](#architecture--approach) for details.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (see [.nvmrc](../../.nvmrc)` in the repo for the required version)
- [npm](https://www.npmjs.com/) (v10 or later)
- [Git](https://git-scm.com/)
- [Nx CLI](https://nx.dev/getting-started/intro) (recommended for monorepo management)

  ```bash
  npm install -g nx@latest
  ```

---

## Getting started

1. **Clone the monorepo:**

   ```bash
   git clone https://github.com/moneyadviceservice/maps-apps.git
   cd maps-apps
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   > **Note:** All required environment variables are already configured in the Netlify dashboard for this project.

   **Recommended:**  
    Simply link your local project to the correct Netlify site by running the following command and selecting the app from the dropdown:

   ```bash
   netlify link
   ```

   **If you do NOT have access to Netlify:**  
    Declare the variables locally using the keys in [.env.example](./.env.example).

   Either create a new `.env.local` in the **root** of the mono repo and paste the variables or append an existing `.env.local`.

   Update the variables with their values obtained from a peer developer or environment owner:

4. **Run the development server:**

   Since this app uses Netlify Functions, you should use Netlify Dev to run the app locally:

   ```bash
   netlify dev --filter moneyhelper-contact-forms
   ```

   If that command does not work, try the npx wrapper:

   ```bash
   npx netlify dev --filter moneyhelper-contact-forms
   ```

   This uses the configuration in `netlify.toml` and ensures your Netlify Functions and environment are available locally.

   The app will be available at [http://localhost:8888](http://localhost:8888).

---

## Environment Variables

The app requires several environment variables for API access and configuration, including those needed for the shared Redis instance.  
**These are already set up in the Netlify dashboard for this project.**  
**See [`libs/shared/redis/README.MD`](../../libs/shared/redis/README.MD) for full details.**

| Variable                             | Description                     |
| ------------------------------------ | ------------------------------- |
| `AZURE_MANAGED_REDIS_HOST_NAME`      | Azure Redis host name (no port) |
| `AZURE_MANAGED_REDIS_CLIENT_ID`      | Azure Redis Client ID           |
| `AZURE_MANAGED_REDIS_CLIENT_SECRET`  | Azure Redis Client Secret       |
| `AZURE_MANAGED_REDIS_TENANT_ID`      | Azure Redis Tenant ID           |
| `NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT` | Adobe Script                    |
| `API_URL`                            | Azure Function endpoint         |
| `API_CODE`                           | Azure Function endpoint code    |

You do **not** need to set these manually unless you are running outside of Netlify or need to override them for local testing.

---

## Branch and Backend Environment Mapping

The `API_URL` and `API_CODE` variables are used to connect this application to different Azure Function endpoints.  
**Netlify branches have been set up to enable different environment variables for each branch, allowing the frontend to target the correct backend environment.**

- Each branch in Netlify (e.g. `dev-gsi`, `qa-gsi`, `uat-gsi`) is mapped to a specific Azure Function endpoint.
- The backend team has configured the Azure Function URLs to match the corresponding frontend branch, ensuring seamless integration.
- When you push to a branch, Netlify automatically uses the correct `API_URL` and `API_CODE` for that environment.

For full details and a mapping table, see:  
[Environment Mapping D365 (BAU-GSI) to Netlify](<https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1171/Environment-Mapping-D365-(BAU-GSI)-to-Netlify>)

**Adding Branches / Environments**

If further branches are required, they should be added to Netlify and configured with the appropriate environment variables for `API_URL` and `API_CODE` to ensure the frontend connects to the correct Azure Function endpoint.

For each new branch, coordinate with the backend team to confirm the endpoint mapping and set any additional required variables in the Netlify dashboard.

---

## Testing and Linting

### Running Tests

Suggested approach is to use NX Console Vscode Plugin. (refer to the suggested section of the [extension.json](../../.vscode/extensions.json))

**Alternatively:**

```bash
# Typecheck
npx nx run moneyhelper-contact-forms:typecheck

#Linting
npx nx run moneyhelper-contact-forms:lint

# Update snapshots
npx nx run moneyhelper-contact-forms:snapshots

# Coverage report
npx nx run moneyhelper-contact-forms:test

# E2E tests
npx nx run moneyhelper-contact-forms-e2e:e2e-headed

```

### Test Coverage

Coverage reports are generated in `coverage/maps-apps/apps/moneyhelper-contact-forms/`.

To view the HTML coverage report:

```bash
open coverage/maps-apps/apps/moneyhelper-contact-forms/lcov-report/index.html
```

---

## Architecture and Approach

The MoneyHelper Contact Forms app is designed around a dynamic, config-driven approach for multi-step forms and custom flows. The main concepts are:

- **Form Handler:** Handles form submissions, runs validation, persists state to the store (using shared Redis helpers), and routes the user to the next step or displays errors. Validation logic is declared in schemas (see `routeSchemas.ts`).

- **Validation:** Each step's validation rules are defined in Zod schemas, allowing for robust, type-safe validation and custom logic per step.

- **Dynamic Routing:** The app uses a dynamic slug-based approach for routing, enabling flexible multi-step flows. The current step is determined by the URL and the flow configuration.

- **Flows (`routeFlow.ts`):** All possible form flows are declared in `routeFlow.ts` as arrays of step names. This allows for easy addition and modification of flows, supporting different user journeys and service types.

```ts
...
  [
    FlowName.SCAMS,
    [
      StepName.ENQUIRY_TYPE,
      StepName.ABOUT_SCAMS,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.LOADING,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
...
```

- **Step-to-Component Mapping (`routeConfig.ts`):** Each step name is mapped to a React component in `routeConfig.ts`, along with an array of guards to run before rendering. This enables dynamic rendering of the correct UI for each step.

```ts
...
 [StepName.NAME]: {
    Component: Name,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
...
```

- **Guards:** Guards are functions that run before a step is rendered, handling logic such as cookie/session checks, validation, or redirects. The `guards` array in `routeConfig.ts` allows for step-specific guard logic.

- **Auto-Advance & Deep-Linking (`autoAdvanceGuard.ts`):**  
  The app supports deep-linking directly to a specific flow and auto-advancing the user to the correct starting step using the `?aa=flow-name` query parameter. This is handled by the `autoAdvanceGuard`, which:

  - Checks for the `aa` query param on initial load.
  - Looks up the correct starting step for the given flow using a central `AUTO_ADVANCE_STEP_MAP` (see [`lib/constants`](./lib/constants/)).
  - Initializes the session and store for the user, sets the correct step index, and redirects to the appropriate step.
  - Ensures SSR and Netlify function compatibility, including robust cookie/session handling.

  **To add or update auto-advance behavior for a flow:**

  - Update the `AUTO_ADVANCE_STEP_MAP` in [`lib/constants`](./lib/constants/) to map the flow name to the desired starting step.
  - The guard will automatically handle new flows as long as they are present in your flow config.

  This enables robust, flexible deep-linking for campaigns, support, or partner integrations, and ensures users always land on the correct step for their journey.

- **Static Pages:** While most pages are dynamically rendered based on the flow and config, static pages can be added for custom content or one-off requirements.

This architecture provides:

- Maximum flexibility for new flows and services
- Centralized validation and routing logic
- Easy extension for new steps, flows, or custom pages
- Robust error handling and state persistence

For more details, see:

- [`routes/routeFlow.ts`](./routes/routeFlow.ts) for flow definitions
- [`routes/routeConfig.ts`](./routes/routeConfig.ts) for step/component mapping and guards
- [`routes/routeSchemas.ts`](./routes/routeSchemas.ts) for validation schemas
- [`store/`](./store/) for state management and Redis integration

---

## Contributing

- Follow the existing code style within the app and inline with the [frontend best practices](https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
