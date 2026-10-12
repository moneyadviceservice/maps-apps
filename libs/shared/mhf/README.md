# MoneyHelper Forms Shared Library (`libs/shared/mhf`)

---

## Table of Contents

- [Purpose](#purpose)
- [What’s Included](#whats-included)
  - [Store Management](#store-management)
  - [Store Update Patterns](#store-update-patterns)
  - [Dynamic Steps Array & Flow Construction](#dynamic-steps-array--flow-construction)
  - [Common Guards](#common-guards)
  - [Validation Utilities](#validation-utilities)
  - [Shared Components](#shared-components)
  - [Type System](#type-system)
  - [Utilities](#utilities)
- [Directory Structure](#directory-structure)
- [Usage](#usage)
  - [Minimal Setup](#minimal-setup)
  - [Form Routing](#form-routing)
    - [Default Form Route](#default-form-route)
    - [Configurable Form Paths](#configurable-form-paths)
- [Extending in Apps](#extending-in-apps)
  - [Type Extension Pattern](#type-extension-pattern)
  - [Custom Guards](#custom-guards)
  - [Store Data Extension](#store-data-extension)
- [Testing](#testing)
- [Accessibility & Language](#accessibility--language)
- [Contribution](#contribution)

This library provides the **base components, store logic, guards, validation, and utilities** for all MoneyHelper forms apps in the MaPS Digital monorepo.  
It is designed for maximum reusability, strict TypeScript mode, and bilingual support (English/Welsh).

## Purpose

- Centralizes all **form journey logic** for MoneyHelper apps (e.g. Booking Forms, Contact Forms)
- Ensures **consistency** and **DRY code** across 24+ Next.js applications
- Supports **JavaScript-free functionality** and **accessibility** requirements
- Enables **easy extension** for app-specific needs

---

## What’s Included

### Store Management

Session creation, retrieval, and mutation using shared Redis helpers:

- `ensureSessionAndStore()` - Initialize or retrieve session with UUID and store entry
- `getStoreEntry()` - Retrieve form data from Redis by session key
- `setStoreEntry()` - Update form data in Redis
- Store types and interfaces for strict TypeScript mode

MHF sessions use the explicit `SESSION_TTL_SECONDS` value from the shared
constants. `setStoreEntry()` applies this value to the Redis entry and
`ensureSessionAndStore()` applies the same value as the session cookie's
`Max-Age`, keeping the browser cookie and Redis entry lifetime aligned.

**Session Cookie Configuration:**

Each consuming app must set a `COOKIE_NAME` environment variable to a value unique to that app. This is required so apps sharing this library on the same domain don't read/overwrite each other's session cookie. `ensureSessionAndStore()`, `getSessionId()`, and `cleanupSession()` all throw if `COOKIE_NAME` is not set.

**Store Update Patterns:**

Store updates occur during form submission and navigation, using the shared helpers provided by this library. Apps handle their own form data and journey logic, calling `setStoreEntry()` to persist changes as needed.

For implementation details, see the app-specific README files:

- [Contact Forms README](../../apps/moneyhelper-contact-forms/README.md)
- [Booking Forms README](../../apps/moneyhelper-booking-forms/README.md)

### Submission State Machine

`runSubmissionStateMachine()` coordinates an API submission: it persists
`IN_PROGRESS` before calling the API, routes fresh concurrent requests to the
loading page, and delegates success and error routing to the consuming app. The
request that owns the lock returns its state to `IDLE` when it finishes while
retaining `responseData` for a later submission to replace.

### Dynamic Steps Array & Flow Construction

Apps that use this shared library (e.g. MoneyHelper Contact Forms, MoneyHelper Booking Forms) construct an array of steps (`entry.steps[]`) dynamically during the user journey, based on the submitted `nextStep` value from each form submission. This sets the next step for the user while also creating a breadcrumb trail that is used when the user goes back a step (via the back button or browser back button).

**How it works:**

- Each time a user submits a form, the handler extracts the `nextStep` value.
- The `resolveNextSteps()` utility updates the steps array, splicing in the new step and discarding any future steps, following a "git rebase" pattern.
- This enables flexible branching, junctions, and backward navigation, allowing users to change their path at any decision point.
- The store always reflects the user's current journey, supporting both forward progression and dynamic rerouting.

**Key Functions:**

- `resolveNextSteps(entry, stepName)` — Rebases the steps array based on the submitted step.
- `getBackStep(context)` — Calculates the previous step for back navigation from the current request context.
- `getCurrentStep(context)` — Determines the current step from the request URL.

**Benefits:**

- Supports complex, multi-path journeys without hardcoding step arrays.
- Enables deep-linking, auto-advance, and dynamic flow changes.
- Keeps user progress and history intact, even when switching flows.

See app-specific READMEs for implementation examples.

### Common Guards

Reusable guard functions that run before rendering steps:

- `cookieGuard` - Ensures session cookie exists, redirects if missing
- `validateStepGuard` - Validates current step is accessible in flow
- `runGuardsBase()` - Helper to execute guard arrays in sequence

### Validation Utilities

Shared Zod schemas and validation helpers:

- `parseFormData()` - Parse submitted fields, including junction values and next-step routing
- `syncCurrentStep()` - Synchronize the stored step index with the submitted current step
- Phone number validation (UK format)
- Postcode validation (UK format)
- Date of birth validation with age checks
- `validateFormSubmission()` - Generic form submission validator

### Shared Components

Reusable React components for consistent UX:

- `FormWrapper` - Main form container with navigation, error handling
- `FormErrorCallout` - Accessible error message display
- `OptionTypes` - Radio button and checkbox components
- `SectionsRenderer` - Dynamic form section rendering
- `SubTitleRenderer` - Consistent subtitle formatting

All components support Welsh/English via `useTranslation` hook.

### Type System

Base types and interfaces that apps extend for their specific needs:

- `Entry` - Store entry structure
- `EntryData` - Form field data types
- Guard and validation types

### Utilities

Helper functions for form flow management:

- `getCurrentStep()` - Determine current step from URL/store
- `buildFormPath()` - Build a form step URL using the locale and configured base path
- `getBackStep()` - Calculate previous step in journey
- `getFieldError()` - Extract field-specific error messages
- `getSessionId()` - Retrieve session ID from cookies
- `getCookieName()` - Read the app's `COOKIE_NAME` env var, throws if unset
- `findEncodedOptionValue()` - Restore encoded option values for submitted junction fields
- `safeT()` - Safe translation helper with fallbacks

---

## Directory Structure

```
libs/shared/mhf/
├── src/
│   ├── components/         # Shared React components for forms
│   ├── constants/          # Shared MHF constants, including session TTL
│   ├── form/               # Form parsing and validation helpers
│   ├── guards/             # Common guard functions
│   ├── layouts/            # Shared layout components
│   ├── mocks/              # Test mocks for store/entry
│   ├── store/              # Store/session helpers
│   ├── types/              # Shared TypeScript types/interfaces
│   └── utils/              # Utility functions for form flows
```

---

## Usage

Use the Nx aliases from `tsconfig.base.json` for all shared MHF imports. Do not use relative imports.

### Minimal Setup

For the smallest working form structure, see the [Minimal MHF Form Setup](./MINIMAL_SETUP.md)
guide. It includes the folder structure and starter content for constants,
route configuration, guard wiring, the dynamic step page, and a form step
component.

### Form Routing

#### Default Form Route

By default, form steps are defined in a Next.js Pages Router dynamic route:

```text
apps/<form-app>/pages/[language]/[step]/index.tsx
```

The corresponding URLs are flat beneath the language segment:

```text
/en/step-1
/cy/step-1
```

The value in `StepName` represents only the step, for example `step-1`. It
does not include the language or any route prefix. `getCurrentStep()` uses the
request URL to extract that step for route configuration and guard processing.

#### Configurable Form Paths

Form apps can optionally configure a route prefix with an app-level constant:

```typescript
// apps/<form-app>/form/constants/index.ts
export const FORM_BASE_PATH = 'application-form';
```

Apps using the default flat route can use an empty value:

```typescript
export const FORM_BASE_PATH = '';
```

With a configured prefix, the dynamic route is nested under that prefix:

```text
apps/<form-app>/pages/[language]/application-form/[step]/index.tsx
```

The same pattern supports a deeper prefix, for example:

```text
apps/<form-app>/pages/[language]/application-form/forms/[step]/index.tsx
```

> The value of `FORM_BASE_PATH` must match the route segments between
> `[language]` and `[step]`. For example, `FORM_BASE_PATH = 'application-form'`
> requires `pages/[language]/application-form/[step]/index.tsx`. If the value and
> folder structure do not match, step extraction and redirects will target the
> wrong path.

`FORM_BASE_PATH` is an app-owned prefix value, rather than shared environment
configuration. Leading and trailing slashes are removed by the shared path
helpers, and multiple path segments are supported. It should not normally be
interpolated directly into URLs, because callers would need to handle optional
slashes themselves.

Use `buildFormPath()` as the default MHF convention whenever a component, guard,
or server handler constructs a form step URL. Do not construct these URLs with
inline locale, base-path, and step template strings:

```typescript
import { buildFormPath } from '@maps-react/mhf/utils';

const path = buildFormPath(locale, StepName.FIRST_PAGE);
```

When an app uses a configured prefix, pass its constant as the optional third
argument:

```typescript
const path = buildFormPath(locale, StepName.FIRST_PAGE, FORM_BASE_PATH);
```

This produces `/en/first-page` with an empty base path, or
`/en/application-form/first-page` with `FORM_BASE_PATH` set to
`application-form`. For a deeper configured prefix such as
`application-form/forms`, it produces `/en/application-form/forms/first-page`.

Pass the same optional value to `getCurrentStep()`, `runGuardsBase()`, and
guards that construct redirects. Existing apps using the default flat route
can omit the optional argument. `StepName` values remain unchanged.

For example, an app-specific guard entry point can pass its configuration once:

```typescript
import { runGuardsBase } from '@maps-react/mhf/guards';

export const runGuards = (context: GetServerSidePropsContext) =>
  runGuardsBase(context, routeConfig, guardMap, FORM_BASE_PATH);
```

---

## Extending in Apps

Apps extend the MHF library foundation to add app-specific behavior:

### Type Extension Pattern

Extend base interfaces to add app-specific properties:

```typescript
import { FlowConfig } from '@maps-react/mhf/types';

// Extend with app-specific properties
export interface ContactFlowConfig extends FlowConfig {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
  autoAdvanceStep?: StepName;
}
```

### Custom Guards

Apps can use custom guards that run via MHF's `runGuardsBase()`:

```typescript
import { runGuardsBase } from '@maps-react/mhf/guards';

export async function myCustomGuard(context: GetServerSidePropsContext) {
  // Custom logic here
}

// In routeConfig.ts
guards: [Guards.COOKIE_GUARD, Guards.MY_CUSTOM_GUARD];
```

### Store Data Extension

Apps can store additional fields in the `EntryData`:

```typescript
const entry = await getStoreEntry(key);
entry.data['custom-field'] = 'value';
await setStoreEntry(key, entry);
```

**See app-specific READMEs for implementation examples:**

- [Contact Forms README](../../apps/moneyhelper-contact-forms/README.md)
- [Booking Forms README](../../apps/moneyhelper-booking-forms/README.md)

---

## Testing

Run all shared library tests:

```bash
# Unit tests with coverage
nx test mhf

# Watch mode
nx test mhf --watch

# Update snapshots
nx test mhf --updateSnapshot
```

All components and utilities in the MHF library have comprehensive unit tests co-located with their implementation.

---

## Accessibility & Language

- All components are accessible and work with keyboard navigation.
- All text uses the translation hooks for Welsh/English support.

---

## Contribution

- Follow MaPS monorepo patterns and strict mode.
- Add unit tests for all new components and helpers.
- Use Nx aliases for all imports.

---

For more details on app-specific flows and architecture, see the [MoneyHelper Contact Forms README](../../apps/moneyhelper-contact-forms/README.md).
