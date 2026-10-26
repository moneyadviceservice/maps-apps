# Travel Insurance Directory E2E Tests

End-to-end tests for the Travel Insurance Directory application using Playwright.

## Running Tests

```bash
npx nx run travel-insurance-directory-e2e:e2e
```

```bash
npx nx run travel-insurance-directory-e2e:e2e-headed
```

Optional:

- `BASE_URL` — app under test (default `http://localhost:4313`)

## Self-serve login email

Self-serve specs and helpers share one login email per **pipeline instance** (or local machine) via `selfServeCreds.ACCOUNT_LOGIN_EMAIL`.

Address shape:

`e2e-user+{runId}@test.com`

- **Pipeline:** `BUILD_BUILDID` only (Azure pipeline instance). Same build → same email for every worker / retry; different builds → different emails.
- **Local:** `{hostname}-{username}-local` (stable per machine/user). Override with `TID_E2E_SELF_SERVE_EMAIL` or `TID_E2E_SELF_SERVE_RUN_ID` if you need concurrent local runs.
- **Global setup** writes the email to `.auth/self-serve-email.txt` once so workers and teardown never diverge.

Invalid/unknown-email scenarios keep stable fixtures (`not-an-email`, `unknown-user-e2e@maps.test`) and are unaffected by uniqueness. Do not use `unknown-user-e2e@maps.test` as a login email; it is reserved for the unknown-user error case.

### Firm data (Cosmos)

Entra login is mocked under `CI=true`, but firm resolution hits **real staging Cosmos** by `principal.email_address`. On successful OTP verify (and on `/ci/self-serve/initialise-e2e-firm-state`), the app **ensures** a main firm exists for that run’s email (create if missing, then reset to the E2E baseline). Concurrent **pipeline** runs are isolated by `BUILD_BUILDID`.

`/ci/self-serve/initialise-e2e-firm-state` requires an `accountMock` query to be passed for example: `/ci/self-serve/initialise-e2e-firm-state?accountMock=setEmptySelfServeState`. Available account mocks are currently:
`setEmptySelfServeState`, `setCompletedHiddenSelfServeState`, `setCompletedActiveSelfServeState`, `setFcaUnauthorisedSelfServeState`, `setInvalidTradingNameSelfServeState`.

At the end of the Playwright run, **global teardown** calls `/ci/self-serve/cleanup-e2e-firm` for the email in `.auth/self-serve-email.txt` and deletes that main firm plus linked trading docs (pass, fail, or most Ctrl+C interrupts). The Next app must still be reachable at `BASE_URL` with `CI=true`. Hard process kills may leave orphans named `e2e-user+…@test.com`.

## Admin firm directory actions (Cosmos)

Admin **dashboard** list/search e2e uses the in-memory CI fixture (`CI=true`). Firm-detail Add/Hide journeys use **dedicated Cosmos firms** (not in that fixture) so `getFirmById` hits Cosmos and mutations use real `updateFirm`.

Requires the Next app with **`CI=true`** (and staging Cosmos). Seed/reset URL:

```
GET /ci/admin/initialise-e2e-firm-state?firm=A|B|C|all
```

| Query      | Seed state                                            | Detail actions (default)                | Redirect                                   |
| ---------- | ----------------------------------------------------- | --------------------------------------- | ------------------------------------------ |
| `firm=A`   | Registered + self-serve **complete** + **hidden**     | Add to Directory (+ Re-register)        | `/admin/firms/tid-e2e-cosmos-admin-firm-a` |
| `firm=B`   | Registered + self-serve **complete** + **active**     | Hide from Directory (+ Re-register)     | `/admin/firms/tid-e2e-cosmos-admin-firm-b` |
| `firm=C`   | Registration **incomplete** (+ self-serve incomplete) | No admin actions (Add/Hide/Re-register) | `/admin/firms/tid-e2e-cosmos-admin-firm-c` |
| `firm=all` | Seeds A, B, and C                                     | —                                       | `/admin/dashboard`                         |

Notes:

- Specs live in `tests/admin/firm-directory-actions.spec.ts` and run in the Playwright project `admin-directory-actions` (`workers: 1`) so shared Cosmos docs are not raced.
- Run only that project: `npx nx run travel-insurance-directory-e2e:e2e -- --project=admin-directory-actions`
- E2e ids/names: `data/adminCosmosE2eConstants.data.ts` — keep in sync with app registry `lib/ci/adminE2eFirmConstants.ts`.
- This is separate from self-serve `/ci/self-serve/initialise-e2e-firm-state` (account OTP + FRN `123456`).
