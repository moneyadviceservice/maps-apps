# Retirement Budget Planner E2E tests

Run the same regression suite against `local`, `dev`, `test`, `preprod`, or `prod` using `TARGET_ENV`. Remote URLs do not start the Nx local server.

| Environment | Default origin |
| --- | --- |
| `local` | `http://localhost:4300` |
| `dev` | `https://develop--retirement-budget-planner.netlify.app` |
| `test` | Set `TEST_BASE_URL` |
| `preprod` | Set `PREPROD_BASE_URL` |
| `prod` | `https://retirement-budget-planner.moneyhelper.org.uk` |

## Configuration

Copy `.env.example` to `.env.local` in this directory if a private configuration does not already exist. All template values are intentionally blank; an empty `TARGET_ENV` defaults to `local`.

Set `TEST_BASE_URL` and `PREPROD_BASE_URL` to your team's deployment origins, without routes such as `/en/landing`. Set `HTTP_PASSWORD` privately for Netlify password-protected deployments. Navigation supplies it only when the password page appears; missing credentials produce a configuration error. Never commit `.env.local` or passwords.

Shell/CI variables take precedence over `.env.local`. `BASE_URL` overrides the selected environment. `LOCAL_BASE_URL`, `DEV_BASE_URL`, and `PROD_BASE_URL` override their defaults. Invalid selectors and missing test/preprod URLs fail before tests start.

## Release regression runs

From the repository root in PowerShell, set `$env:TARGET_ENV = 'prod'` (or `preprod`, `test`, `dev`, `local`), then run `npx playwright test --config=apps/e2e/retirement-budget-planner-e2e/playwright.config.ts`.

Clear an earlier one-off URL override before switching environments: `Remove-Item Env:BASE_URL -ErrorAction SilentlyContinue`.

- Headed serial run: append `--headed --workers=1`.
- Landing smoke tests: append `src/e2e/tests/landing.spec.ts`.
- Discovery only (does not run tests): append `--list`.
- No retries for first-attempt regression evidence: append `--retries=0`.
- One-off deployment: set `$env:BASE_URL` to its origin before running.

The existing 100-second test/action/navigation/assertion timeouts and two retries are preserved. Local runs start or reuse the RBP server on port 4300; custom local origins must point to that server. CI should provide the selector, deployment URL overrides, and any password through pipeline variables/secrets rather than tracked files.
