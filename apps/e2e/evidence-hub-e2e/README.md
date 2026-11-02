# Evidence Hub E2E Tests

Playwright tests for [Evidence Hub](../../evidence-hub/).

## Run

```bash
npx playwright install   # one-time

npx nx run evidence-hub-e2e:e2e
npm run test:e2e evidence-hub-e2e   # Playwright UI — select a spec and press Run
```

Playwright starts the app on port 4312 via `webServer`.

If tests hang or the browser is blank, clear port 4312 and rerun:

```bash
lsof -ti :4312 | xargs kill -9
```

## Mock documents

Research library tests expect fixture-backed documents. Set `CI=true` when running locally (the pipeline sets this automatically):

```bash
CI=true npx nx run evidence-hub-e2e:e2e
```

Mocking is implemented in [`aemHeadlessClient.ts`](../../evidence-hub/utils/aem/aemHeadlessClient.ts) for document queries only. Homepage and tag filters still use live AEM.

Fixtures: `apps/evidence-hub/fixtures/e2e/`. Keep [`researchLibraryCiE2eConstants.data.ts`](src/data/researchLibraryCiE2eConstants.data.ts) in sync when changing them.

| Spec | Notes |
| ------ | -------- |
| `homepage.spec.ts` | Live AEM homepage and teaser accessibility |
| `research-library-pagination.spec.ts` | Results per page |
| `research-library-filters.spec.ts` | Filter counts |
| `research-library-search.spec.ts` | Keyword search |
| `research-library-sort.spec.ts` | Sort order |

## Prerequisites

- `apps/evidence-hub/.env.local` with AEM credentials (homepage and tags)
- Pipeline secrets via Key Vault (`run-affected-e2e.sh`)
