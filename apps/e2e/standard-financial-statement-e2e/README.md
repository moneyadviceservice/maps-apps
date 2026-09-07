# Standard Financial Statement E2E Tests

End-to-end tests for the [Standard Financial Statement](../../standard-financial-statement/) application using [Playwright](https://playwright.dev/) and [Nx](https://nx.dev/).

## Running Tests

### Local development

```bash
npx nx e2e standard-financial-statement-e2e
```

Tests start `netlify dev` on port **8888** when no server is running. Free ports **4380** and **8888** if a previous run left processes behind:

```bash
lsof -ti :4380,:8888 | xargs kill -9
```

### Headed / UI mode

```bash
npx nx e2e-headed standard-financial-statement-e2e
```

### Remote environments

Create `.env.local` in this project (gitignored):

```bash
BASE_URL=https://your-deployed-sfs-url
PROJECT_NAME=standard-financial-statement
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:8888` | Application URL under test |
| `PROJECT_NAME` | `standard-financial-statement` | Netlify filter / report path |

## Project Structure

```
apps/e2e/standard-financial-statement-e2e/
├── playwright.config.ts
├── project.json
├── tsconfig.json
└── src/
    ├── data/              # Nav links, form validation fixtures
    ├── e2e/tests/         # Spec files (*.spec.ts)
    ├── lib/               # Playwright fixtures, env, mocks
    ├── pages/             # Page Object Models
    └── utils/             # Shared test helpers (e.g. data layer)
```

## Conventions

- **Fixtures:** `test.lib.ts` exposes `extendedPage`, `homePage`, and `applyToUsePage`.
- **Selectors:** Prefer `data-testid` via `HEADER_LINK`, `NAV_LINK`, and `FOOTER_LINK` in `src/data/nav.data.ts`.
- **Waits:** Assert on visible elements (e.g. `page-heading`, `image-link`) or use `verifyDataLayer`, which polls the Adobe data layer. Avoid `networkidle` — background requests can prevent it from resolving.
- **Desktop:** Viewport is fixed at 1440×900 so header desktop nav is always used.
- **Cookies:** Civic cookie consent is mocked via `cookie-consent.mock.ts` (`**/c/v**` route).
- **JS disabled:** `js-disabled.spec.ts` uses plain `@playwright/test` with `javaScriptEnabled: false`.

## Mocked APIs

Apply-to-use signup flows mock `/api/user-sign-up` via `user-sign-up.mock.ts` so tests do not hit real auth services.
