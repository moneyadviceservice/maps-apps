# Submission State Machine

`runSubmissionStateMachine()` coordinates API submissions for server-rendered forms, including when JavaScript is disabled. It saves submission state and response data to the MHF store (Redis) through `setStoreEntry()`, so subsequent requests can determine whether to call the API, show the loading page, or route to the success or error flow.

The state machine keeps its data in `entry.meta`:

The `SubmissionMeta` type is defined in [`src/types/index.ts`](../types/index.ts).

```ts
type SubmissionMeta = {
  submissionState: SubmissionState;
  submissionKey?: string;
  responseData?: ResponseData;
  submissionStartedAt?: string;
  submissionErrorStatus?: string;
};
```

`submissionState` is one of `idle`, `in_progress`, `succeeded`, or `failed`. The other fields track which request the state belongs to, its response, and any information needed to handle a timeout or error.

## Table of Contents

- [How it works](#how-it-works)
- [Configuration](#configuration)
- [Choose a submission key](#choose-a-submission-key)
- [Stored submission metadata](#stored-submission-metadata)

## How it works

The state machine tracks each submission using four states. This is what each state means for the request and the user's next page:

```ts
enum SubmissionState = IDLE || IN_PROGRESS || SUCCEEDED || FAILED;
```

| State         | What happens                                                                                                                                                                                                             | Option or handler                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `IDLE`        | No matching request is in progress. The machine saves `IN_PROGRESS` and starts the API call.                                                                                                                             | `submit`                                    |
| `IN_PROGRESS` | If the same request is still running, the user is sent to the loading screen without starting another API call. If it has been stuck too long, the request is treated as failed and the user is sent to the error route. | `loadingDestination` or `errorDestination`  |
| `SUCCEEDED`   | The machine saves the API response, then handles the successful result without calling the API again.                                                                                                                    | `onSuccess`                                 |
| `FAILED`      | The error is mapped to a status, then the user is sent to the error route without calling the API again.                                                                                                                 | `resolveErrorStatus` and `errorDestination` |

## Configuration

Pass these options to `runSubmissionStateMachine()`:

| Option               | Required | Purpose                                                                                                            |
| -------------------- | -------: | ------------------------------------------------------------------------------------------------------------------ |
| `entry`              |      Yes | Form entry; the state machine stores submission metadata here.                                                     |
| `key`                |      Yes | Store key used to persist the entry.                                                                               |
| `locale`             |      Yes | Language passed to the app's success handler.                                                                      |
| `submissionKey`      |      Yes | Identifies the logical submission and determines whether a request reuses stored state or starts a new submission. |
| `loadingDestination` |      Yes | Route used for a matching, fresh `IN_PROGRESS` submission.                                                         |
| `errorDestination`   |      Yes | Builds the error route from a status code.                                                                         |
| `resolveErrorStatus` |      Yes | Maps a thrown error to the status used by `errorDestination`.                                                      |
| `submit`             |      Yes | Performs the API call and returns response data. Throw to indicate failure.                                        |
| `onSuccess`          |      Yes | Handles a successful submission, such as advancing the flow and returning a redirect.                              |
| `onError`            |       No | Logs or handles the error. Defaults to a warning containing the flow and submission metadata.                      |

## Choose a submission key

The submission key tells the state machine whether a request belongs to the same submission as the one recorded in `entry.meta`.

| Key strategy                | Example                                        | Use when                                                          |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| Stable key from the payload | `createSubmissionKey(JSON.stringify(payload))` | Matching payloads should reuse the same submission state.         |
| New unique key              | `crypto.randomUUID()`                          | Each intended request should start a fresh submission.            |
| Fixed key                   | `'contact-submit'`                             | Requests for one logical operation should share submission state. |

For a payload-based key, import the helper:

```ts
import { createSubmissionKey } from '@maps-react/mhf/submission';

const submissionKey = createSubmissionKey(JSON.stringify(payload));
```

**New unique key:**

Examples: [Booking Forms - getBookingSlots ](../../../../apps/moneyhelper-booking-forms/lib/utils/submitFlow.ts)

```ts
const submissionKey = crypto.randomUUID();
```

**Fixed key:**

```ts
const submissionKey = 'contact-submit';
```

## Example: wire up a submission flow

A typical submission has two parts: a `submitFlow` wrapper that configures the shared state machine, a loading page, and a submit page that calls it. To start the process, the user is directed to the loading page. To start the process, the user is directed to the loading page. After a brief delay, the page redirects to the submit route, which starts the state machine and submission request. If the request is still in progress, the state machine redirects back to loading, where the user waits until the next check. Once the submission succeeds, onSuccess determines the next destination; if it fails, the user is sent to the configured error route. All the while, the user sees the loading page.

```ts
// lib/utils/submitFlow.ts
export function submitFlow({ entry, key, locale }) {
  return runSubmissionStateMachine({
    entry,
    key,
    locale,
    submissionKey: 'form-submit',
    loadingDestination: `/${locale}/loading`,
    errorDestination: (status) => `/${locale}/error?status=${status}`,
    resolveErrorStatus: (error) => getStatus(error),
    submit: (entry) => postSubmission(entry),
    onSuccess: (entry, key, locale) =>
      advanceAndRedirect(entry, key, `/${locale}/confirmation`),
  });
}
```

```ts
// pages/[language]/submit/index.tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const key = getSessionId(context);
  const entry = await getStoreEntry(key);

  return submitFlow({ entry, key, locale: entry.data.locale || 'en' });
};
```

```tsx
// pages/[language]/loading/index.tsx
export default function LoadingPage() {
  return (
    <>
      <Loading />
      <meta httpEquiv="refresh" content="2;url=../submit" />
    </>
  );
}
```

`submit` performs the API request. `onSuccess` handles app-specific work, such as advancing the flow and returning a redirect.

For a complete working example, see the [contact forms submit flow](../../../../apps/moneyhelper-contact-forms/lib/utils/submitFlow.ts) and its [submit page](../../../../apps/moneyhelper-contact-forms/pages/%5Blanguage%5D/submit/index.tsx) and [loading page](../../../../apps/moneyhelper-contact-forms/pages/%5Blanguage%5D/loading/index.tsx).
The shared API and options are documented in [`runSubmissionStateMachine`](../submission/runSubmissionStateMachine.ts).
