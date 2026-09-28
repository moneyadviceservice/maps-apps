# MoneyHelper Contact Forms E2E Tests

This project contains end-to-end (E2E) tests for the [MoneyHelper Contact Forms](../moneyhelper-contact-forms/) Next.js application, using [Playwright](https://playwright.dev/) for browser automation and [Nx](https://nx.dev/) for monorepo management.

---

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Mocked API Approach](#mocked-api-approach)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

---

## About

This E2E suite validates the user journeys and form flows of the MoneyHelper Contact Forms app, ensuring:

- Accessibility and language support (English & Welsh)
- Correct form validation and error handling
- Accurate navigation and step progression
- **All backend/API integration is fully mocked for E2E reliability and isolation** (no real API calls)

Tests are written in TypeScript and follow the structure and flows defined in the main app.

---

## Key Features

- 🔍 **Full User Journey Coverage:** Simulates real user interactions across all supported form types
- 🌐 **Language-Agnostic Testing:** Uses selectors and helpers that work across all supported languages (where possible)
- 🧪 **Validation Checks:** Ensures all required fields, error messages, and edge cases are covered
- ⚡ **Fast & Reliable:** Runs in headless or headed mode with Playwright
- 🔄 **Reusable Fixtures:** Centralized test data and helpers for maintainability
- 🛡️ **Isolated Mock API Server:** All backend interactions are simulated using a local Express server and configurable mock payloads (no real API calls)

---

## Project Structure

```
apps/e2e/moneyhelper-contact-forms-e2e/
├── playwright.config.ts         # Playwright configuration
├── project.json                 # Nx project config
├── tsconfig.json                # TypeScript config
└── src/
    └── e2e/
      ├── mocks/               # Mock API server, config, and payloads
      ├── lib/constants        # Enums copied over from the app for type safe naming
      ├── fixtures/            # Static fixtures (translations, etc.)
      ├── helpers/             # Test helpers/utilities (robust selectors)
      ├── pages/               # Page Object Models (Playwright locators)
      └── tests/               # Test specs (e.g. *.spec.ts)
```

---

## Prerequisites

- Node.js (see monorepo `.nvmrc` for version)
- npm v10 or later
- Nx CLI (recommended):
  ```bash
  npm install -g nx@latest
  ```
- Playwright (installed via monorepo dependencies)

---

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. For instructions on starting and configuring the MoneyHelper Contact Forms app, see the [main app README](../moneyhelper-contact-forms/README.md).

---

## Environment Variables

E2E runs use a layered env setup:

1. `apps/e2e/moneyhelper-contact-forms-e2e/.env.local`
2. `apps/moneyhelper-contact-forms/.env.local`

The Playwright `webServer.command` loads the e2e `.env.local` file for local runs. The app env is loaded by the app's Netlify configuration.

### What this means in practice

- Shared app/runtime config should live in `apps/moneyhelper-contact-forms/.env.local` (for example `REDIS_API_URL`, `REDIS_API_KEY`, `API_CODE`).
- E2E-specific overrides should live in `apps/e2e/moneyhelper-contact-forms-e2e/.env.local` (for example mock API settings and `API_URL`).
- In CI, Playwright runs Netlify directly and uses pipeline-provided environment variables.

### First-time local setup

1. Ensure app env is configured by following the main app Environment Variables section: [MoneyHelper Contact Forms README](../moneyhelper-contact-forms/README.md#environment-variables).

2. Create e2e env from template:

- `cp apps/e2e/moneyhelper-contact-forms-e2e/.env.example apps/e2e/moneyhelper-contact-forms-e2e/.env.local`

3. In e2e `.env.local`, set only test-specific values (example below):

```dotenv
MOCK_API_PORT=4001
MOCK_API_PATH=/mockEndPoint
API_URL=http://localhost:${MOCK_API_PORT}${MOCK_API_PATH}
```

That is all you need for E2E local setup, assuming the main app `.env.local` is already valid.

### CI notes

- CI variables are provided by the pipeline environment.
- Do not rely on local `.env.local` files in CI.
- Keep any CI-only values in the pipeline secret store.

---

## Mocked API Approach

This E2E suite uses a **mocked API server** to simulate backend responses for form submissions. This ensures tests are reliable, fast, and do not depend on live backend services.

### How It Works

- A local Express server is started automatically before tests (see `src/e2e/global-setup.ts`) and stopped after tests (see `src/e2e/global-teardown.ts`).
- The mock server intercepts POST requests to `/mockEndPoint` and matches the request payload to predefined mock payloads and configuration in [`src/e2e/mocks/mock-data.ts`](src/e2e/mocks/mock-data.ts).
- If a match is found, a success response is returned with a dynamic message (e.g., `CAS-pensions-guidance`). Otherwise, a validation error is returned.
- The mock server is fully isolated from production and can be extended with new payloads as needed for new test scenarios.

### Extending the Mock

- To add new scenarios, update the relevant mock payloads or configuration in [`mock-data.ts`](src/e2e/mocks/mock-data.ts) with the required payload and key.
- The matching logic is based on the `kindofEnquiry` and the full request body (see mock-constants.ts for details).
- The mock API can be further customized for negative/error cases or additional endpoints if needed.

**Relevant files:**

- [`src/e2e/mocks/mock-api.ts`](src/e2e/mocks/mock-api.ts) — Express server and matching logic
- [`src/e2e/global-setup.ts`](src/e2e/global-setup.ts) — Starts the mock server before tests
- [`src/e2e/global-teardown.ts`](src/e2e/global-teardown.ts) — Stops the mock server after tests

---

## Running Tests

Suggested approach is to use the Nx Console VS Code plugin (refer to the suggested section of [extension.json](../../../.vscode/extensions.json)).

Run targets from Nx Console:

- Project: `moneyhelper-contact-forms-e2e`
- Targets: `e2e` (headless), `e2e-headed` (headed)

CLI equivalents:

Run E2E tests in headed mode (with browser UI):

```bash
npx nx run moneyhelper-contact-forms-e2e:e2e-headed
```

Or in headless mode:

```bash
npx nx run moneyhelper-contact-forms-e2e:e2e
```

Test results and reports will be output to the console and Playwright's default output directory.

---

## Contributing

- Follow the structure and naming conventions in this repo.
- Add/modify tests as new features or flows are added to the main app.
- Run all tests before submitting a PR. See [PR Etiquette guidelines](https://mapswiki.atlassian.net/wiki/spaces/RD/pages/798818308/Pull+Request+PR+Etiquette).
- For more details, see the [main app README](../moneyhelper-contact-forms/README.md).
