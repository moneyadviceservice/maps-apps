# Minimal MHF Form Setup

This guide shows the smallest structure needed to create a Next.js Pages Router form using `@maps-react/mhf`.

For complete examples, see:

- [MoneyHelper Contact Forms](../../apps/moneyhelper-contact-forms/README.md) for a simpler form flow.
- [MoneyHelper Booking Forms](../../apps/moneyhelper-booking-forms/README.md) for branching journeys and additional guards.

## Folder Structure

```text
apps/<form-app>/
├── pages/
│   └── [language]/
│       ├── [step]/index.tsx
│       ├── loading/index.tsx
│       ├── submit/index.tsx
│       └── confirmation/index.tsx
├── form/
│   ├── components/
│   │   └── FirstStep.tsx
│   ├── constants/
│   │   └── index.ts
│   ├── guards/
│   │   └── runGuards.ts
│   └── routes/
│       ├── routeConfig.ts
│       └── routeSchemas.ts
├── netlify/
│   └── functions/
│       └── form-handler.mts
└── .env.local
```

For a nested route, define the matching folder structure. For example, with
`FORM_BASE_PATH = 'application-form'`:

See the [configurable form paths section in the MHF README](./README.md#configurable-form-paths)
for the routing rules and helper usage.

```text
pages/[language]/application-form/[step]/index.tsx
```

`FORM_BASE_PATH` must match the route segments between `[language]` and
`[step]`.

## Constants

```typescript
// form/constants/index.ts
export const FORM_BASE_PATH = '';

export enum StepName {
  FIRST_STEP = 'first-step',
}

export enum Guards {
  VALIDATE_STEP_GUARD = 'validateStepGuard',
}
```

For a nested route:

```typescript
export const FORM_BASE_PATH = 'application-form';
```

`StepName` values contain only the step name. Do not include the language or
base path in them.

## Route Configuration

```typescript
// form/routes/routeConfig.ts
import { RouteConfig } from '@maps-react/mhf/types';

import { StepName, Guards } from '../constants';
import { FirstStep } from '../components/FirstStep';

export const routeConfig: RouteConfig = {
  [StepName.FIRST_STEP]: {
    Component: FirstStep,
    guards: [Guards.VALIDATE_STEP_GUARD],
  },
};
```

## Guard Entry Point

```typescript
// form/guards/runGuards.ts
import { GetServerSidePropsContext } from 'next';

import {
  cookieGuard,
  runGuardsBase,
  validateStepGuard,
} from '@maps-react/mhf/guards';

import { FORM_BASE_PATH, Guards } from '../constants';
import { routeConfig } from '../routes/routeConfig';

const guardMap = {
  [Guards.COOKIE_GUARD]: cookieGuard,
  [Guards.VALIDATE_STEP_GUARD]: validateStepGuard,
};

export const runGuards = (context: GetServerSidePropsContext) =>
  runGuardsBase(context, routeConfig, guardMap, FORM_BASE_PATH);
```

Apps using the default flat route may omit the fourth `runGuardsBase` argument,
because the shared helpers default to an empty base path.

For a form that stores session data, keep `cookieGuard` in the guard map. A
guard map containing only `validateStepGuard` is suitable only for a flow that
does not require the shared session cookie.

## Dynamic Step Page

```typescript
// pages/[language]/[step]/index.tsx
import type { GetServerSideProps, NextPage } from 'next';

import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';
import {
  getStoreEntry,
  getStoreErrors,
  getStoreFlow,
} from '@maps-react/mhf/store';
import type { Entry, PageProps } from '@maps-react/mhf/types';
import { getBackStep } from '@maps-react/mhf/utils/getBackStep';

import { FORM_BASE_PATH } from '../../../form/constants';
import { runGuards } from '../../../form/guards';
import { routeConfig } from '../../../form/routes/routeConfig';

const Page: NextPage<PageProps> = ({ step, backStep, errors, entry, flow }) => {
  const { Component } = routeConfig[step] || {};

  if (!Component) {
    throw new TypeError(
      `Component not found in flow: ${flow}, for step: ${step}`,
    );
  }

  return (
    <Component errors={errors} entry={entry} step={step} backStep={backStep} />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  await runGuards(context);

  const key = getSessionId(context);
  const step = getCurrentStep(context, FORM_BASE_PATH);

  return {
    props: {
      step,
      backStep: await getBackStep(context),
      errors: await getStoreErrors(context),
      flow: await getStoreFlow(context),
      entry: (await getStoreEntry(key)) as Entry,
    },
  };
};

export default Page;
```

If the route uses a base path, pass the same `FORM_BASE_PATH` to
`getCurrentStep()` as shown above.

## Form Step Component

```typescript
// form/components/FirstStep.tsx
import { FormWrapper } from '@maps-react/mhf/components';

import { StepName } from '../constants';

type FirstStepProps = {
  step: string;
};

export function FirstStep({ step }: FirstStepProps) {
  return (
    <FormWrapper step={step} nextStep={StepName.FIRST_STEP}>
      <h1>First step</h1>
    </FormWrapper>
  );
}
```

Use the project translation hooks and validation patterns in a real form. The
example above only demonstrates the minimum route/component relationship.

## Validation Schemas

Keep step validation schemas with the route configuration:

```typescript
// form/routes/routeSchemas.ts
import { z } from 'zod';

import { StepName } from '../constants';

export const validationSchemas = {
  [StepName.FIRST_STEP]: z.object({
    exampleField: z.string().min(1),
  }),
};
```

The form handler passes these schemas to `validateFormSubmission()` before
updating the stored entry.

## Form Handler

The form handler is the JavaScript-free POST boundary. It should parse the
submitted form, validate it, update the store, resolve the next step, and
redirect using `buildFormPath()`:

```typescript
// netlify/functions/form-handler.mts
import {
  parseFormData,
  resolveNextSteps,
  syncCurrentStep,
  validateFormSubmission,
} from '@maps-react/mhf/form';
import { buildFormPath } from '@maps-react/mhf/utils';
import {
  ensureSessionAndStore,
  getStoreEntry,
  setStoreEntry,
} from '@maps-react/mhf/store';

import { FORM_BASE_PATH, StepName } from '../../form/constants';
import { validationSchemas } from '../../form/routes/routeSchemas';

export default async function formHandler(req: Request) {
  const requestData = await req.formData();
  const { parsedData, nextStep, currentStep } = parseFormData(requestData);
  const session = await ensureSessionAndStore(req, StepName.FIRST_STEP);
  const entry = await getStoreEntry(session.key);

  syncCurrentStep(entry, currentStep);
  const errors = validateFormSubmission(entry, parsedData, validationSchemas);

  if (errors) {
    entry.errors = errors;
  } else {
    resolveNextSteps(entry, nextStep);
    entry.stepIndex++;
  }

  await setStoreEntry(session.key, entry);

  /* Include session response headers in the real implementation. */
  const destination = buildFormPath(
    parsedData.locale,
    entry.steps[entry.stepIndex],
    FORM_BASE_PATH,
  );
  session.responseHeaders.set('Location', destination);
  return new Response(null, {
    status: 303,
    headers: session.responseHeaders,
  });
}
```

The complete handler must also handle `POST` validation, preserve the existing
session cookie, and redirect to an error step when processing fails. See the
form-handler implementations in Contact Forms and Booking Forms for the
production pattern.

## Loading, Submit, and Confirmation Pages

These pages are optional for a very small synchronous form, but are useful when
submission has a loading state or a separate confirmation step:

```text
pages/[language]/loading/index.tsx
pages/[language]/submit/index.tsx
pages/[language]/confirmation/index.tsx
```

Their responsibilities are:

- `loading`: display the loading state and advance or redirect to `submit`.
- `submit`: load the stored entry, call the submission flow, and redirect to
  `confirmation` or an error step.
- `confirmation`: verify the submission succeeded, display the confirmation,
  and optionally clean up the session.

When using a nested form route, place these pages under the same base-path
folder and use `buildFormPath(locale, step, FORM_BASE_PATH)` for every redirect.

A submit page typically delegates to an app-specific submission helper:

```typescript
// pages/[language]/submit/index.tsx
export const getServerSideProps = async (context) =>
  runSubmitFlow({
    entry,
    key,
    locale,
    code,
    url,
  });
```

Resolve `entry`, `key`, `locale`, `code`, and `url` from the request and app
configuration before calling the helper.

The loading and confirmation pages are ordinary Pages Router pages. They use
`FormsLayout` or an app-specific wrapper and should keep translation keys,
submission state, and error handling in the app rather than in shared routing
helpers. The complete page implementations are intentionally left to the
Contact Forms and Booking Forms examples because their submission workflows
differ.

## Building Form URLs

Use `buildFormPath()` for links and redirects instead of assembling locale,
base-path, and step segments manually:

```typescript
import { buildFormPath } from '@maps-react/mhf/utils';

const path = buildFormPath(locale, StepName.FIRST_STEP, FORM_BASE_PATH);
```

This produces `/en/first-step` for an empty base path and
`/en/application-form/first-step` for the configured nested route.

## Required Application Configuration

Each consuming app must provide a unique `COOKIE_NAME` environment variable for
its session cookie. The shared store and session helpers require it.

The app also needs its normal Redis/session configuration and a Netlify
function route for `form-handler.mts`. The exact variable names and deployment
configuration are app-specific; copy the relevant setup from one of the full
form applications rather than inventing a new session contract.

Other requirements, including Redis configuration, translations, validation,
form submission handling, and app-specific layouts, depend on the form journey.
Use the Contact Forms and Booking Forms applications as the complete reference
implementations.
