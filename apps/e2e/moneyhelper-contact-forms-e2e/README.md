# MoneyHelper Contact Forms E2E Tests

This project contains end-to-end (E2E) tests for the [MoneyHelper Contact Forms](../moneyhelper-contact-forms/) Next.js application, using [Playwright](https://playwright.dev/) for browser automation and [Nx](https://nx.dev/) for monorepo management.

---

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

---

## About

This E2E suite validates the user journeys and form flows of the MoneyHelper Contact Forms app, ensuring:

- Accessibility and language support (English & Welsh)
- Correct form validation and error handling
- Accurate navigation and step progression
- Integration with backend APIs and Netlify Functions

Tests are written in TypeScript and follow the structure and flows defined in the main app.

---

## Key Features

- 🔍 **Full User Journey Coverage:** Simulates real user interactions across all supported form types
- 🌐 **Language-Agnostic Testing:** Uses selectors and helpers that work across all supported languages (where possible)
- 🧪 **Validation Checks:** Ensures all required fields, error messages, and edge cases are covered
- ⚡ **Fast & Reliable:** Runs in headless or headed mode with Playwright
- 🔄 **Reusable Fixtures:** Centralized test data and helpers for maintainability

---

## Project Structure

```
apps/e2e/moneyhelper-contact-forms-e2e/
├── playwright.config.ts         # Playwright configuration
├── project.json                 # Nx project config
├── tsconfig.json                # TypeScript config
└── src/
    └── e2e/
      ├── data/                # Test data bridge (language-agnostic)
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

## Running Tests

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
