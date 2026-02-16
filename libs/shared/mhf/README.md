# MoneyHelper Forms Shared Library (`libs/shared/mhf`)

This library provides the **base components, store logic, guards, validation, and utilities** for all MoneyHelper forms apps in the MaPS Digital monorepo.  
It is designed for maximum reusability, strict TypeScript mode, and bilingual support (English/Welsh).

---

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

**Store Update Patterns:**

The store is updated in two key locations during the form journey:

1. **In Form Handlers** (app-specific, e.g., `netlify/functions/form-handler.mts`):

   - Updates `entry.data` with validated form submission data
   - Manages flow changes and step progression
   - Increments `stepIndex` on successful validation
   - Updates `errors` object if validation fails
   - Calls `setStoreEntry(key, entry)` to persist changes

2. **In `validateStepGuard`** (this library):
   - Updates `stepIndex` when user navigates backwards to a previous step
   - Clears `errors` when step changes (going back)
   - Prevents users from skipping forward in the flow
   - Calls `setStoreEntry(key, entry)` to persist navigation changes

This ensures the store always reflects the user's current position and form state, supporting both forward progression and backward navigation.

### Flow Configuration Pattern

All MHF apps use a dynamic flow configuration pattern to control the user journey:

**Core Concepts:**

- **Steps Array**: Journey steps are stored in `entry.steps[]` array, serving as both navigation path and breadcrumb trail
- **Step Index**: Current position tracked via `entry.stepIndex`
- **Flow Junctions**: Decision points where the journey branches based on user selections
- **Git Rebase Pattern**: When users select a different path at a junction, the form handler:
  1. Preserves completed steps (history prefix)
  2. Truncates future steps (discards old path)
  3. Splices in new flow steps (applies new path)

**Example Flow Junctions:**

```
Junction at step B:
Route 1: A → B → C → D → E → F
Route 2: A → B → B1 → B2 → C → D → E → F

Junction at step E:
Route 1: A → B → C → D → E → F
Route 2: A → B → C → D → E → E1 → E2
```

This pattern allows users to navigate backwards, choose different options at junctions, and follow new paths without losing their progress.

**Utilities Supporting Flow Configuration:**

- `getFlowSteps()` - Retrieves step array for a given flow from routeFlow configuration
- `getBackStep()` - Calculates previous step from breadcrumb trail for back navigation
- `getCurrentStep()` - Determines current step from URL context

**Implementation Details:**

Each app implements:

- `routeFlow.ts` - Map of all flows and their step sequences
- `form-handler` - Detects junctions and applies git rebase pattern to steps array
- `routeConfig.ts` - Maps steps to components and guards

See app-specific READMEs for implementation examples.

### Common Guards

Reusable guard functions that run before rendering steps:

- `cookieGuard` - Ensures session cookie exists, redirects if missing
- `validateStepGuard` - Validates current step is accessible in flow
- `runGuardsBase()` - Helper to execute guard arrays in sequence

### Validation Utilities

Shared Zod schemas and validation helpers:

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
- `RouteFlowValue` - Base flow configuration interface (extensible)
- Guard and validation types

### Utilities

Helper functions for form flow management:

- `getFlowSteps()` - Get steps array for a flow from routeFlow Map
- `getCurrentStep()` - Determine current step from URL/store
- `getBackStep()` - Calculate previous step in journey
- `getFieldError()` - Extract field-specific error messages
- `getSessionId()` - Retrieve session ID from cookies
- `safeT()` - Safe translation helper with fallbacks

---

## Directory Structure

```
libs/shared/mhf/
├── src/
│   ├── components/         # Shared React components for forms
│   ├── form/               # Validation helpers and schemas
│   ├── guards/             # Common guard functions
│   ├── layouts/            # Shared layout components
│   ├── mocks/              # Test mocks for store/entry
│   ├── store/              # Store/session helpers
│   ├── types/              # Shared TypeScript types/interfaces
│   └── utils/              # Utility functions for form flows
```

---

## Usage

**Import shared code using Nx aliases:**

```typescript
// Components
import { FormWrapper, FormErrorCallout } from '@maps-react/mhf/components';

// Store helpers
import {
  ensureSessionAndStore,
  getStoreEntry,
  setStoreEntry,
} from '@maps-react/mhf/store';

// Validation
import { validateFormSubmission } from '@maps-react/mhf/form';

// Guards
import { cookieGuard, validateStepGuard } from '@maps-react/mhf/guards';

// Utilities
import {
  getFlowSteps,
  getCurrentStep,
  getBackStep,
} from '@maps-react/mhf/utils';

// Types
import { Entry, EntryData, RouteFlowValue } from '@maps-react/mhf/types';
```

**Never use relative imports for shared code. Always use the aliases from `tsconfig.base.json`.**

---

## Extending in Apps

Apps extend the MHF library foundation to add app-specific behavior:

### Type Extension Pattern

Extend base interfaces to add app-specific properties:

```typescript
import { RouteFlowValue } from '@maps-react/mhf/types';

// Extend with app-specific properties
export interface ContactRouteFlowValue extends RouteFlowValue {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
  autoAdvanceStep?: StepName;
}
```

### Custom Guards

Apps can create custom guards that use MHF's `runGuardsBase()`:

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
