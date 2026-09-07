# MoneyHelper Booking Forms

A Next.js application for the MoneyHelper Booking Forms, built and maintained by the Money and Pensions Service (MaPS). This app enables users to access and submit booking forms for various MoneyHelper services, supporting both English and Welsh languages.

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
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Architecture and Approach](#architecture-and-approach)
- [Troubleshooting and Debugging](#troubleshooting-and-debugging)
- [Contributing](#contributing)

---

## About

MoneyHelper Booking Forms is part of the [maps-apps monorepo](https://github.com/moneyadviceservice/maps-apps). This app provides a multi-step, branch-able booking flow for MoneyHelper appointment services, supporting both English and Welsh languages.

The flow dynamically adapts based on user responses, leading to one of several outcomes:

- **Self-service booking** — user selects a day and time slot
- **Phone-based booking** — for Face-to-Face or longer appointments
- **Ineligible outcome** — user doesn't meet service criteria

The app integrates with enterprise scheduling platforms via Azure Functions and supports referral tracking for Stronger Nudge Providers (partner organisations).

For full architectural and implementation details, see the [Low-Level Design (LLD) — Booking Form](https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1220/Low-Level-Design-Booking-Form) document.

The application is built with [Next.js 14](https://nextjs.org/), managed with [Nx](https://nx.dev/), and deployed using [Netlify](https://www.netlify.com/).

---

## Key Features

- 🌐 **Bilingual Support:** Full Welsh and English language support
- 📝 **Multiple Forms:** Configurable booking flows for various services
- ♿ **Accessibility First:** WCAG 2.1 Level AA compliant via [shared-ui](https://main--65c4bdbe9bcdf2e1145a3b6a.chromatic.com/) components
- 🔒 **Secure Submission:** Data validation via [zod](https://zod.dev/) and secure API integration
- 📱 **Responsive Design:** Mobile-first, responsive layouts
- 🚀 **Performance Optimized:** Server-side rendering with Next.js for JS and Non-JS browser instances
- 🔄 **Data Persistence:** Form state recovery and confirmation flows using [shared Redis helpers](../../libs/shared/redis/README.MD)
- ⚙️ **Config-Driven Architecture:** Centralized flow configuration with extensible properties for flow-specific behavior

---

## Shared Library (MHF)

This app is built on top of the **[MoneyHelper Forms (`libs/shared/mhf`) shared library](../../libs/shared/mhf/)**, which provides reusable store logic, guards, validation helpers, form components, and utilities for all MoneyHelper form applications.

**See the [MHF README](../../libs/shared/mhf/README.md) for complete details on what the library provides.**

**How this app uses the MHF library:**

- Uses shared session + Redis helpers for state management
- Reuses common guards for cookie/session and step validation
- Uses shared validation utilities (e.g. phone, postcode, date of birth)
- Leverages shared form wrapper and components for consistent UX
- Extends MHF base types for booking-specific flow configuration

---

## Prerequisites

- [Node.js](https://nodejs.org/) (see [.nvmrc](../../.nvmrc) in the repo for the required version)
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
   netlify dev --filter moneyhelper-booking-forms
   ```

   If that command does not work, try the npx wrapper:

   ```bash
   npx netlify dev --filter moneyhelper-booking-forms
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
| `COOKIE_NAME`                        | Session cookie name             |

You do **not** need to set these manually unless you are running outside of Netlify or need to override them for local testing.

---

## Branch and Backend Environment Mapping

TBC

---

## Testing and Linting

### Running Tests

Suggested approach is to use NX Console Vscode Plugin. (refer to the suggested section of the [extension.json](../../.vscode/extensions.json))

**Alternatively:**

```bash
# Typecheck
npx nx run moneyhelper-booking-forms:typecheck

#Linting
npx nx run moneyhelper-booking-forms:lint

# Update snapshots
npx nx run moneyhelper-booking-forms:snapshots

# Coverage report
npx nx run moneyhelper-booking-forms:test

# E2E tests
npx nx run moneyhelper-booking-forms-e2e:e2e-headed

```

### Test Coverage

Coverage reports are generated in `coverage/maps-apps/apps/moneyhelper-booking-forms/`.

To view the HTML coverage report:

```bash
open coverage/maps-apps/apps/moneyhelper-booking-forms/lcov-report/index.html
```

### Architecture and Approach

This app leverages the dynamic steps array and flow configuration pattern provided by the [MoneyHelper Forms Shared Library (MHF)](../../libs/shared/mhf/README.md#dynamic-steps-array--flow-construction).
All journey logic, branching, and step management are handled using the shared library’s utilities and store helpers.

For a full explanation of the architecture, flow pattern, and store update logic, see the [MHF README](../../libs/shared/mhf/README.md).

#### Junction Value Encoding (Booking Forms)

Booking Forms currently uses two routing patterns during form submission:

- **Linear steps**: route using the hidden `nextStep` input provided by `FormWrapper`
- **Junction steps**: route using encoded radio values in the format `answer|nextStep`

For junction steps, the form handler parses the selected value, stores the `answer` part under the semantic field name (for example, `accessSupportStatus`), and uses the parsed `nextStep` part for step rebasing and navigation.

Implementation references:

- [`netlify/functions/form-handler.mts`](./netlify/functions/form-handler.mts): submission handling and next-step resolution
- [`lib/utils/parseFormData.ts`](./lib/utils/parseFormData.ts): parsing of linear vs junction payloads
- [`routes/routeSchemas.ts`](./routes/routeSchemas.ts): schema keys for semantic junction field names
- [`public/locales/en.json`](./public/locales/en.json) and [`public/locales/cy.json`](./public/locales/cy.json): junction radio option values using `answer|nextStep`

#### App-specific Implementation

- [`flowConfig.ts`](./routes/flowConfig.ts): Defines all flow sequences and junctions for Booking Forms
- [`netlify/functions/form-handler.mts`](./netlify/functions/form-handler.mts): Handles form submission, junction detection, and step rebasing
- [`routes/routeConfig.ts`](./routes/routeConfig.ts): Maps steps to components and guards
- [`routes/routeSchemas.ts`](./routes/routeSchemas.ts): Zod validation schemas
- [`docs/routing-diagrams.md`](./docs/routing-diagrams.md): Sectioned Mermaid routing diagrams

Booking-specific features:

- Adaptive outcomes: Self-service slot selection, phone-based booking, or ineligible outcome
- Enterprise scheduling integration: Azure Functions bridge
- Referral tracking: Stronger Nudge Providers support

See the [MHF README](../../libs/shared/mhf/README.md) for details on the shared architecture and flow pattern.

---

## Troubleshooting and Debugging

When any route, guard, handler, or transport flow fails, the app can redirect to the error page with a status query param.
This section is an app-wide reference so developers can map status values to likely causes during debugging.

Primary references:

- [lib/constants/index.ts](./lib/constants/index.ts): source of response status values

### Error Page Status Codes

Use this as the source-of-truth table for known app-level status values.
Add new rows as additional status mappings are introduced.

| Status | Constant (if defined)                 | Typical Source Area                            | Meaning                                                                                                                       |
| ------ | ------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 103    | `ResponseMessage.GENERIC_ERROR`       | Catch-all fallback across app handlers/routes  | Unknown or unclassified error. Used when no known status can be safely derived from the thrown error.                         |
| 104    | `ResponseMessage.SUBMISSION_FAILED`   | Submission state handling                      | Submission reached a failed state (including stale in-progress timeout and explicit failed-state transitions).                |
| 105    | `ResponseMessage.FORM_HANDLER_ERROR`  | Action/handler validation in async submit flow | Invalid or missing async action, or action-level handler failure before successful completion.                                |
| 900    | `AppErrorCode.LOADING_ROUTE_FALLBACK` | Loading route fallback                         | Loading route fallback error in [loading action page](./pages/[language]/loading/[action]/index.tsx).                         |
| 901    | `AppErrorCode.SUBMIT_ROUTE_FALLBACK`  | Submit route fallback                          | Submit route fallback error in [submit action page](./pages/[language]/submit/[action]/index.tsx).                            |
| 902    | `AppErrorCode.ROUTE_SETUP_FALLBACK`   | Route setup fallback                           | Route setup fallback for page-level SSR setup failures (for example guard execution, session key resolution, or store reads). |

Notes:

- A status value may originate from multiple places in the app; the source area identifies common origins, not an exclusive single file.
- Some status values are constants (for example 103/104/105), while others can be local fallbacks from route-specific logic.
- If the error page receives an unfamiliar status, trace from the redirecting route first, then add that status to this table.

### Debug Workflow

1. Check the redirected URL status value on the error page.
2. Trace where the redirect came from. Common origins:
   - Submit route fallback: [submit action page](./pages/[language]/submit/[action]/index.tsx)
   - Loading route fallback: [loading action page](./pages/[language]/loading/[action]/index.tsx)
   - Submission state machine catch path: [submissionStateMachine.ts](./lib/utils/submissionStateMachine.ts)
   - Form-handler catch paths: [netlify/functions/form-handler.mts](./netlify/functions/form-handler.mts)
3. Review server logs for context fields such as flow and meta from the warning emitted by the submission state machine.
4. Confirm whether the action is valid and has both a handler in [submitHandlers.ts](./lib/utils/submitHandlers.ts) and a success destination in [lib/constants/index.ts](./lib/constants/index.ts).

### Shared MHF Reference

MHF currently provides shared guards, store helpers, and flow utilities, but does not yet maintain a centralized status-code catalog.
If a shared status/error reference is added later, prefer documenting shared codes in [libs/shared/mhf/README.md](../../libs/shared/mhf/README.md) and linking back to it from this section.

---

## Contributing

- Follow the existing code style within the app and inline with the [frontend best practices](https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
