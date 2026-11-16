# MoneyHelper Booking Forms E2E Tests

This project contains end-to-end (E2E) tests for the [MoneyHelper Booking Forms](../moneyhelper-booking-forms/) Next.js application, using [Playwright](https://playwright.dev/) for browser automation and [Nx](https://nx.dev/) for monorepo management.

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
- [Accessibility Testing](#accessibility-testing)
- [Fixtures and Page Objects](#fixtures-and-page-objects)
- [Linting](#linting)
- [Contributing](#contributing)

---

## About

This E2E suite validates the user journeys and form flows of the MoneyHelper Booking Forms app, ensuring:

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
apps/e2e/moneyhelper-booking-forms-e2e/
├── playwright.config.ts         # Playwright configuration
├── eslint.config.mjs            # E2E ESLint and import-resolution rules
├── project.json                 # Nx project config
├── tsconfig.json                # TypeScript config
└── src/
    ├── mocks/                   # Mock API server
    ├── lib/                     # Test fixture exports and environment helpers
    ├── fixtures/                # Typed Playwright fixtures
    ├── helpers/                 # Test helpers/utilities
    ├── pages/                   # Page Object Models and locators
    └── tests/                   # Test specs (e.g. *.spec.ts)
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

2. For instructions on starting and configuring the MoneyHelper Booking Forms app, see the [main app README](../moneyhelper-booking-forms/README.md).

---

## Environment Variables

E2E runs use a layered env setup:

1. `apps/e2e/moneyhelper-booking-forms-e2e/.env.local`
2. `apps/moneyhelper-booking-forms/.env.local`

The Playwright `webServer.command` loads the e2e `.env.local` file for local runs. The app env is loaded by the app's Netlify configuration.

### What this means in practice

- Shared app/runtime config should live in `apps/moneyhelper-booking-forms/.env.local` (for example `REDIS_API_URL`, `REDIS_API_KEY`, `API_CODE`).
- E2E-specific overrides should live in `apps/e2e/moneyhelper-booking-forms-e2e/.env.local` (for example mock API settings and `API_URL`).
- In CI, Playwright runs Netlify directly and uses pipeline-provided environment variables.

### First-time local setup

1. Ensure app env is configured by following the main app Environment Variables section: [MoneyHelper Booking Forms README](../moneyhelper-booking-forms/README.md#environment-variables).

2. Create e2e env from template:

- `cp apps/e2e/moneyhelper-booking-forms-e2e/.env.example apps/e2e/moneyhelper-booking-forms-e2e/.env.local`

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

- A local mock server is started automatically before tests (see [`src/global-setup.ts`](src/global-setup.ts)) and stopped after tests (see [`src/global-teardown.ts`](src/global-teardown.ts)).
- The mock server intercepts POST requests to `/mockEndPoint` and matches the request payload to its configured scenarios in [`src/mocks/mock-api.ts`](src/mocks/mock-api.ts).
- If a match is found, a success response is returned with a dynamic message (e.g., `CAS-pensions-guidance`). Otherwise, a validation error is returned.
- The mock server is fully isolated from production and can be extended with new payloads as needed for new test scenarios.

### Extending the Mock

- To add new scenarios, update the mock server's matching logic and scenario responses in [`src/mocks/mock-api.ts`](src/mocks/mock-api.ts).
- The matching logic is based on the `kindofEnquiry` and request body.
- The mock API can be further customized for negative/error cases or additional endpoints if needed.

**Relevant files:**

- [`src/mocks/mock-api.ts`](src/mocks/mock-api.ts) — Mock server and matching logic
- [`src/global-setup.ts`](src/global-setup.ts) — Starts the mock server before tests
- [`src/global-teardown.ts`](src/global-teardown.ts) — Stops the mock server after tests

---

## Running Tests

Suggested approach is to use the Nx Console VS Code plugin (refer to the suggested section of [extension.json](../../../.vscode/extensions.json)).

Run targets from Nx Console:

- Project: `moneyhelper-booking-forms-e2e`
- Targets: `e2e` (headless), `e2e-headed` (headed)

CLI equivalents:

Run E2E tests in headed mode (with browser UI):

```bash
npx nx run moneyhelper-booking-forms-e2e:e2e-headed
```

Or in headless mode:

```bash
npx nx run moneyhelper-booking-forms-e2e:e2e
```

Run all E2E specs:

```bash
npx nx e2e moneyhelper-booking-forms-e2e
```

Run only the accessibility specs:

```bash
npx nx e2e moneyhelper-booking-forms-e2e --grep Accessibility
```

Playwright runs the configured Google Chrome and Microsoft Edge projects. The CI reporter writes an HTML report to this project's `playwright-report/` directory; local runs report results in the terminal.

## Accessibility Testing

The `src/tests/accessibility.spec.ts` suite runs [axe-core](https://github.com/dequelabs/axe-core) through `@axe-core/playwright` against the rendered pages. It checks axe's WCAG 2.2 Level AA rules (including WCAG 2.0 and 2.1 A/AA rules) on the guidance, eligibility, safeguarding, access-support, not-eligible, and error pages. Iframes are excluded from the scan.

Each accessibility test should navigate to a real page state using the existing page objects, then assert that the axe violations list is empty. Keep tests isolated so a failure identifies the page with the issue. When adding a new page or a materially different state, add an accessibility scan for it.

Automated scans are a useful baseline, not proof of WCAG conformance. They cannot reliably verify keyboard operability, focus order and visibility, understandable error announcements, or the experience with assistive technology. For changed journeys, also manually check keyboard-only use and visible focus; include screen-reader checks (VoiceOver on macOS, and NVDA or another supported Windows reader where available) during QA. Record and remediate findings before release in line with the product's accessibility process. Refer to the [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/).

## Fixtures and Page Objects

- Import `test` and `expect` from `@mhbf-e2e/lib/test.lib`. The test fixture extends the shared Playwright fixtures and provides typed page-object fixtures.
- The `cookieControl` fixture is automatic; it sets the shared cookie-control state for each test. Tests do not need to request it explicitly.
- Use the provided page-object fixtures (for example, `definedContributionPage` or `ukPensionsPage`) rather than creating mutable page objects at module scope. Put reusable navigation and locators in `src/pages/`.
- The shared default fixture is re-exported by `src/fixtures/test.fixtures.ts`, so standard Playwright fixtures remain available to specs importing from the project fixture export.

## Linting

The Nx `lint` target runs ESLint using this project's `eslint.config.mjs`. The configuration combines the repository's shared ESLint rules with the shared Maps Playwright E2E rules and Playwright's recommended rules. It also enables `import/no-unresolved`, so imports that cannot be resolved—including incorrect aliases—fail lint.

Run lint after changing a spec, fixture, page object, or helper:

```bash
npx nx lint moneyhelper-booking-forms-e2e
```

Read the file and rule named in each lint message, fix the underlying issue, and rerun the command. Lint checks code and import conventions; it is not a substitute for running the relevant Playwright tests or type-checking.

Follow the project's TypeScript and import-alias patterns. Keep fixture and page-object types explicit, prefer Playwright locator methods (such as `page.getByRole(...)`) over page-level shortcuts, and resolve warnings instead of adding broad rule suppressions. If a suppression is necessary, keep it to the smallest applicable line or block and explain why.

### Import aliases

Aliases are declared in [`tsconfig.json`](tsconfig.json) under `compilerOptions.paths`. The `*` is a wildcard for the remaining path, and each mapped path is relative to this E2E project's `tsconfig.json` directory. For example:

| Alias | Resolves to | Example |
| --- | --- | --- |
| `@mhbf-e2e/pages/*` | `src/pages/*` | `@mhbf-e2e/pages/Eligibility` |
| `@mhbf-e2e/lib/*` | `src/lib/*` | `@mhbf-e2e/lib/test.lib` |
| `@mhbf-e2e/fixtures/*` | `src/fixtures/*` | `@mhbf-e2e/fixtures/test.fixtures` |
| `@mhbf-e2e/mocks/*` | `src/mocks/*` | `@mhbf-e2e/mocks/mock-api` |
| `@app/*` | `apps/moneyhelper-booking-forms/*` | `@app/lib/constants` |
| `@maps-react/utils/*` | `libs/shared/utils/src/*` | `@maps-react/utils/e2e/playwright/fixtures/default.fixtures` |
| `@maps-react/mhf/*` | `libs/shared/mhf/src/*` | Use for shared MHF modules |

Use these aliases instead of long relative paths, especially when importing shared code. TypeScript uses the mappings for module resolution, and ESLint's TypeScript import resolver reads the same project `tsconfig.json` to check that aliased imports exist. Keep aliases in sync with their actual source locations; they do not create files or make an invalid path valid.

For example, from an E2E spec:

```ts
import { StepName } from '@app/lib/constants';
import { expect, test } from '@mhbf-e2e/lib/test.lib';
import { DefinedContributionPage } from '@mhbf-e2e/pages/Eligibility';
```

---

## Contributing

- Import `test` and `expect` from the app fixture export (`@mhbf-e2e/lib/test.lib`), rather than directly from `@playwright/test`, so tests use the project's extended fixtures.
- Keep selectors and page interactions in Page Object Models under `src/pages`; specs should express user actions and assertions through those page objects.
- Use the TypeScript aliases defined in this project's `tsconfig.json` (see [Import aliases](#import-aliases)). ESLint checks imports for resolution against that config.
- Create page objects per test or provide them through a typed fixture; do not keep mutable page objects in module-level variables.
- Add or update English journey and Welsh localization coverage as appropriate when flows change.
- Add/modify tests as new features or flows are added to the main app.
- Run the E2E lint target and relevant Playwright tests before submitting a PR.
- Run all tests before submitting a PR. See [PR Etiquette guidelines](https://mapswiki.atlassian.net/wiki/spaces/RD/pages/798818308/Pull+Request+PR+Etiquette).
- For more details, see the [main app README](../moneyhelper-booking-forms/README.md).
