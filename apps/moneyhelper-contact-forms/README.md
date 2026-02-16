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
- [Shared Library (MHF)](#shared-library-mhf)
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

**This app leverages the [MoneyHelper Forms (MHF) shared library](../../libs/shared/mhf/)**, which provides reusable store logic, guards, validation helpers, and form components used across all MoneyHelper form applications in the monorepo.

---

## Key Features

- 🌐 **Bilingual Support:** Full Welsh and English language support
- 📝 **Multiple Forms:** Configurable enquiry form flows for various services
- ♿ **Accessibility First:** WCAG 2.1 Level AA compliant via [shared-ui](https://main--65c4bdbe9bcdf2e1145a3b6a.chromatic.com/) components
- 🔒 **Secure Submission:** Data validation via [zod](https://zod.dev/) and secure API integration
- 📱 **Responsive Design:** Mobile-first, responsive layouts
- 🚀 **Performance Optimized:** Server-side rendering with Next.js for JS and Non-JS browser instances
- 🔄 **Data Persistence:** Form state recovery and confirmation flows using [shared Redis helpers](../../libs/shared/redis/README.MD)
- ⚙️ **Config-Driven Architecture:** Centralized flow configuration with extensible properties for flow-specific behavior
- 🔗 **Deep-Linking & Auto-Advance:** Supports direct links to any flow via query parameter, automatically advancing users to the correct step

---

## Shared Library (MHF)

This app is built on top of the **[MoneyHelper Forms (`libs/shared/mhf`) shared library](../../libs/shared/mhf/)**, which provides reusable store logic, guards, validation helpers, form components, and utilities for all MoneyHelper form applications.

**See the [MHF README](../../libs/shared/mhf/README.md) for complete details on what the library provides.**

**How this app extends the MHF library:**

This Contact Forms app extends the base `RouteFlowValue` interface from MHF to add contact-specific properties:

```typescript
import { RouteFlowValue } from '@maps-react/mhf/types';

export interface ContactRouteFlowValue extends RouteFlowValue {
  showBookingReferenceField?: boolean; // Contact Forms specific
  phoneNumberRequired?: boolean; // Contact Forms specific
  autoAdvanceStep?: StepName; // Contact Forms specific
}
```

This pattern allows the app to leverage shared logic while adding flow-specific behavior without modifying the base library.

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

This app builds on the [MHF shared library](../../libs/shared/mhf/) foundation (see [MHF README](../../libs/shared/mhf/README.md) for base functionality) and adds Contact Forms-specific implementation.

### Foundation from MHF

The MHF library provides:

- Store management (session, Redis integration)
- Base guards (cookie/session checks, step validation)
- Shared validation helpers (phone, postcode, date of birth)
- Form wrapper components
- Base types and utilities

### Contact Forms Implementation

**Flow Configuration:**

This app uses the MHF flow configuration pattern with git rebase at junctions.  
See the [MHF Library README - Flow Configuration Pattern](../../libs/shared/mhf/README.md#flow-configuration-pattern) for the full pattern explanation.

**Contact Forms Implementation:**

- [`routeFlow.ts`](./routes/routeFlow.ts) - All flow definitions and junction configurations
- [`netlify/functions/form-handler.mts`](./netlify/functions/form-handler.mts) - Junction detection and git rebase logic

**Store Management:**

See the [MHF Library README - Store Update Patterns](../../libs/shared/mhf/README.md#store-management) for details on when and where the store is updated.

**Key Files:**

- [`routes/routeFlow.ts`](./routes/routeFlow.ts) - All flow configurations
- [`lib/types/index.ts`](./lib/types/index.ts) - Extended `ContactRouteFlowValue` interface
- [`routes/routeConfig.ts`](./routes/routeConfig.ts) - Step/component mapping
- [`routes/routeSchemas.ts`](./routes/routeSchemas.ts) - Zod validation schemas
- [`guards/autoAdvanceGuard.ts`](./guards/autoAdvanceGuard.ts) - Deep-linking implementation
- [`netlify/functions/form-handler.mts`](./netlify/functions/form-handler.mts) - Form submission and store updates

---

## Contributing

- Follow the existing code style within the app and inline with the [frontend best practices](https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
