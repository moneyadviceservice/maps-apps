# Pension Type Tool E2E tests

## Choose a target environment

The suite reads `TARGET_ENV` (`local`, `dev`, `test`, `preprod`, or `prod`) and resolves the app origin as `BASE_URL`. The test routes already include their language and path, so environment URLs should be origins (no `/en/pension-type` suffix).

- `local` (default): `http://localhost:4303`; starts the local app server automatically.
- `dev`: `https://develop--pension-type-tool.netlify.app` by default.
- `test`: set `TEST_BASE_URL` to the team's test deployment URL.
- `preprod`: set `PREPROD_BASE_URL` to the deployment being tested. The sample `.env.example` contains the Netlify deploy URL previously used for this environment; update it when the deploy changes.
- `prod`: `https://pension-type-tool.moneyhelper.org.uk` by default.

For local repeat runs, copy `.env.example` to `.env.local` in this directory, then fill in the test URL and any required Netlify password. `.env.local` is gitignored. Never commit passwords. `HTTP_PASSWORD` is used only if a Netlify password page is detected.

An explicit `BASE_URL` overrides the selected environment for one-off deployments. You can also override individual endpoints with `LOCAL_BASE_URL`, `DEV_BASE_URL`, `TEST_BASE_URL`, `PREPROD_BASE_URL`, and `PROD_BASE_URL`.

## Run the suite

From the repository root, set the selected target and run the Nx target:

```powershell
$env:TARGET_ENV = 'dev'
npx nx run pension-type-tool-e2e:e2e
```

Replace `dev` with `local`, `test`, `preprod`, or `prod`. For remote Netlify deploys, set `HTTP_PASSWORD` in `.env.local` or the shell environment when required. For a one-off URL:

```powershell
$env:BASE_URL = 'https://your-deploy-host.netlify.app'
npx nx run pension-type-tool-e2e:e2e
```

To run only the landing page spec, append `-- --grep "landing page"` or pass the spec path to Playwright:

```powershell
$env:TARGET_ENV = 'dev'
npx playwright test apps/e2e/pension-type-tool-e2e/src/tests/landingPageToQuestion1.spec.ts --config=apps/e2e/pension-type-tool-e2e/playwright.config.ts
```
