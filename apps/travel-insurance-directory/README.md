# Travel Insurance Directory

Directory of travel insurance firms that specialise in cover for people with serious pre-existing medical conditions. Firms register and keep their listing up to date; the public can search and filter the approved list.

## Quick Start

```bash
# Development server (port 4313)
npx nx serve travel-insurance-directory

# Production build
npx nx build travel-insurance-directory

# Unit / integration tests
npx nx test travel-insurance-directory

# Typecheck
npx nx typecheck travel-insurance-directory

# E2E (Playwright) — see apps/e2e/travel-insurance-directory-e2e/README.md
npx nx e2e travel-insurance-directory-e2e
```

Copy [`.env.example`](.env.example) to `.env.local` and ask a team member for the values.

## What the app does

| Area | Who | Routes |
| --- | --- | --- |
| Public listings | Visitors | `/en`, `/cy`, search and firm detail |
| Registration | Firms | `/register/*` |
| Self-serve account | Authenticated firms | `/account/*` |
| Admin | Internal staff | `/admin/*` |
| CI helpers | Pipeline / e2e | `/ci/*` |

Firm documents live in Cosmos DB. Listings are cached in Redis (see [docs/REDIS.md](docs/REDIS.md)). Scheduled jobs handle cache refresh, re-registration windows, and FCA re-checks.

A firm is not listed just because it registered. Three gates apply:

1. **Registration pre-approval** — all 19 medical-scenario questions answered, at least 15 “yes”. That sets `approved_at` (or `reregister_approved_at`). This is not an FCA check.
2. **Self-serve complete** — cover & service and customer contact confirmed. The firm then sits as `pending_approval`.
3. **Admin Add to Directory** — staff can approve only after (1) and (2), and only if FCA has not blocked the firm.

**FCA** is used to look up the FRN and trading names at registration, then again on a scheduled job. If the firm is no longer authorised (or a trading name is inactive), `hidden_reason` is set and Add / Hide / Re-register are all withheld. An `active` firm with an FCA block is still not shown on the public list.

## Project structure

```
apps/travel-insurance-directory/
├── pages/              # Next.js routes (pages + API)
├── components/         # React UI
├── layouts/            # Page shells
├── lib/                # Server and domain logic
├── data/               # Copy, labels, page config
├── types/              # App-wide TypeScript types
├── utils/              # Small shared helpers
├── hooks/              # React hooks
├── context/            # React context providers
├── tests/              # API / handler tests (Jest)
├── docs/               # App-specific docs
├── public/             # Static assets and locales
├── scripts/            # One-off scripts
├── netlify/            # Netlify functions / config
└── project.json        # Nx targets
```

Tests for a module sit next to the source (`foo.ts` + `foo.test.ts`). API route tests live under `tests/api/`. `index.ts` barrels are only used where the folder is the public import path (for example `lib/account/firmDetails`, `lib/account/tripCover/steps`).

### `pages/`

| Path | Purpose |
| --- | --- |
| `[language]/` | Public English / Welsh listings and firm detail |
| `account/` | Self-serve home, login, firm-details and trip-cover steps |
| `register/` | First-time / renewal registration journey |
| `admin/` | Internal firm dashboard and detail |
| `auth/` | Shared auth pages |
| `api/account/` | Self-serve form and trading-name APIs |
| `api/account-auth/` | Account OTP start / verify / sign-out |
| `api/register/` | Registration APIs |
| `api/admin/` | Admin mutations |
| `api/listings/` | Public listings API |
| `api/scheduled-jobs/` | Cron endpoints |
| `ci/` | E2E seed and cleanup (only useful with `CI=true`) |

### `components/`

UI only. Domain logic belongs in `lib/`.

| Folder | Purpose |
| --- | --- |
| `Account/` | Self-serve forms, trading names, review summary |
| `Register/` | Registration step UI |
| `FirmDetail/`, `FirmSummary/`, `FirmsTable/` | Public listing cards and tables |
| `FilterContent/`, `FilterOptions/`, `FilterSection/` | Listings filters |
| `FcaLookup/` | FCA number lookup |
| `form/` | Shared form controls |
| `Analytics/`, `ExportPDF/`, `MedicalScreeningBanner/` | Supporting UI |

### `layouts/`

| Folder | Purpose |
| --- | --- |
| `TravelInsuranceDirectory/` | Public site shell |
| `TravelInsuranceDirectoryPageLayout/` | Header, footer, cookie banner, and Trustpilot wrapper |
| `ListingsLayout/` | Search results |
| `FirmLayout/` | Account firm pages |
| `SelfServeFormLayout/` | Self-serve step forms |
| `RegisterStepTemplate/` | Registration steps |

### `lib/`

| Folder | Purpose |
| --- | --- |
| `account/` | Self-serve domain logic (see below) |
| `accountAuth/` | Account session and login routes |
| `admin/` | Admin dashboard, detail, and actions |
| `register/` | Registration server-side props and confirm |
| `firms/` | Firm documents, defaults, listings cache |
| `fca/` | FCA register lookup and visibility |
| `database/` | Cosmos connection |
| `cache/` | Redis keys and TTL |
| `sessions/` | Iron session helpers |
| `auth/` | Shared auth utilities |
| `api/` | Form handler factory used by account APIs |
| `notify/` | Email / Notify |
| `scheduledJobs/` | Cron handlers (cache, re-registration) |
| `validate-firms/` | Firm validation used by jobs |
| `analytics/` | Analytics helpers |
| `ci/` | E2E seed, reset, and cleanup |
| `shared/` | Cross-cutting lib helpers |
| `types/` | Lib-local types |

### `lib/account/`

Self-serve logic, grouped by domain.

```
lib/account/
├── dashboard/           # Account home props, layout, section status
├── firmDetails/         # Firm-details routes and page loaders
├── registration/        # Callouts, completion, renewal draft
├── tradingNames/        # Resolve firm, CRUD, search / sort
├── selfServeEditDraft/  # In-progress edit draft merge / clear
├── shared/              # Cross-step helpers (payload, change-answer, GSSP)
├── testing/             # Shared test helpers (not production code)
└── tripCover/
    ├── steps/           # Routes, step order, validation, guards
    ├── confirm/         # Confirm submit and change-answer paths
    ├── shared/          # Firm resolve, API handler, form value helpers
    ├── regionsCovered/
    ├── tripCoverAgeLimits/
    ├── serviceDetails/
    └── medicalSpecialism/
```

`pages/account/*` and `pages/api/account/*` should stay thin and call into this folder.

### `data/`

Static copy and config, not runtime logic.

| Folder | Purpose |
| --- | --- |
| `pages/account/` | Self-serve labels and trip-cover config |
| `pages/register/` | Registration copy |
| `pages/listings/`, `pages/landing/` | Public listings copy |
| `components/` | Shared component strings |
| `analytics/` | Analytics event names |
| `civic-cookies/` | Cookie banner config |

### Other top-level folders

| Folder | Purpose |
| --- | --- |
| `types/` | Shared app types (firm documents, constants, session) |
| `utils/` | API respond/error helpers, listings, pagination, validation |
| `hooks/`, `context/` | Client-only React helpers |
| `tests/api/` | HTTP-level tests for `pages/api/*` |
| `docs/` | App docs (Redis cache acceptance notes) |
| `public/` | Favicon, footer assets, locale files |
| `scripts/` | Maintenance scripts |
| `netlify/` | Hosting / function wiring |

## Related

- E2E: [travel-insurance-directory-e2e](../e2e/travel-insurance-directory-e2e/README.md)
- Workspace setup: [main README](../../README.md)
