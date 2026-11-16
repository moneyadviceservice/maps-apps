# Workplace Pension Calculator E2E tests

The Playwright config supports `TARGET_ENV` values `local`, `dev`, `test`, `preprod`, and `prod`. It resolves the application origin from the environment, and starts the Nx web server only for local URLs.

| Environment | Base URL                                                    |
| ----------- | ----------------------------------------------------------- |
| `local`     | `http://localhost:4315`                                     |
| `dev`       | `https://develop--workplace-pension-calculator.netlify.app` |
| `test`      | Set `TEST_BASE_URL`                                         |
| `preprod`   | Set `PREPROD_BASE_URL`                                      |
| `prod`      | `https://workplace-pension-calculator.moneyhelper.org.uk`   |

For local use, copy `.env.example` to `.env.local` in this directory and set the test/preprod origins and `HTTP_PASSWORD` when required. `.env.local` is gitignored; do not commit passwords. `HTTP_PASSWORD` is used only if the Netlify password page appears.

An explicit `BASE_URL` overrides the selected target for a one-off run. Per-environment overrides are also supported: `LOCAL_BASE_URL`, `DEV_BASE_URL`, `TEST_BASE_URL`, `PREPROD_BASE_URL`, and `PROD_BASE_URL`. Set URLs to the origin only (no calculator route path).

## Run the suite

From the repository root in PowerShell:

```powershell
$env:TARGET_ENV = 'local'
npx playwright test --config=apps/e2e/workplace-pension-calculator-e2e/playwright.config.ts
```

Replace `local` with `dev`, `test`, `preprod`, or `prod`. For test and preprod, configure the corresponding base URL in `.env.local` or the shell environment. For password-protected remote environments, configure `HTTP_PASSWORD` privately in `.env.local` or the shell.

To run headed:

```powershell
$env:TARGET_ENV = 'preprod'
npx playwright test --config=apps/e2e/workplace-pension-calculator-e2e/playwright.config.ts --headed
```

For a one-off deployment URL:

```powershell
$env:BASE_URL = 'https://your-deployment-origin'
npx playwright test --config=apps/e2e/workplace-pension-calculator-e2e/playwright.config.ts
```
