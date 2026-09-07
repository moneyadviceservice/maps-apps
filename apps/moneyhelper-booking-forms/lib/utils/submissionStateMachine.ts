import { setStoreEntry } from '@maps-react/mhf/store';
import { Language } from '@maps-react/mhf/utils';
import { resolveNextSteps } from '@maps-react/mhf/utils/resolveNextSteps';

import {
  ASYNC_ACTION_LOADING_STEP_MAP,
  ASYNC_ACTION_SUCCESS_STEP_MAP,
  AsyncAction,
  ResponseMessage,
  StepName,
  SubmissionState,
} from '../constants';
import { SubmissionEntry, SubmissionMeta } from '../types';
import { submitActionHandlerMap } from './submitHandlers';

const SUBMISSION_STALE_TIMEOUT_MS = 30_000;

/**
 * Retrieves the submission meta from the store entry, or returns a default meta if not present.
 * @param entry
 * @returns
 */
export const getSubmissionStateMeta = (
  entry: SubmissionEntry,
): SubmissionMeta => entry.meta ?? { submissionState: SubmissionState.IDLE };

/**
 * Determines if a submission in progress has become stale based on its startedAt timestamp.
 * Stale = submission has been in progress for longer than the defined timeout, which likely indicates an issue with the submission process (e.g., user closed the tab, network error) and prevents indefinite blocking of the flow.
 * @param startedAt
 * @returns
 */
export const isSubmissionStateStale = (startedAt?: string): boolean => {
  if (!startedAt) {
    return false;
  }

  const startedAtMs = Date.parse(startedAt);
  if (Number.isNaN(startedAtMs)) {
    return false;
  }

  // If the current time is greater than the submission started time plus the timeout, it's stale
  return Date.now() - startedAtMs > SUBMISSION_STALE_TIMEOUT_MS;
};

/**
 * Ensures the mapped success step is current, then redirects to it.
 * @param entry
 * @param key
 * @param locale
 * @returns
 */
export async function advanceStepAndRedirect(
  entry: SubmissionEntry,
  key: string,
  locale: Language,
  action: AsyncAction,
) {
  const successStep = ASYNC_ACTION_SUCCESS_STEP_MAP[action];

  if (entry.steps[entry.stepIndex] !== successStep) {
    resolveNextSteps(entry, successStep);
    entry.stepIndex++;
    await setStoreEntry(key, entry);
  }

  return {
    redirect: {
      destination: `/${locale}/${successStep}`,
      permanent: false,
    },
  };
}

/**
 * Runs the shared submission state machine for async actions.
 *
 * Important data behavior:
 * - `entry.meta.responseData` is treated as a single "latest response" slot.
 * - Each successful action overwrites any previous response payload in meta.
 * - This is intentional in this app; consumers should treat response data as ephemeral.
 *
 * Flow behavior:
 * - The form handler records the loading route as the next journey step.
 * - On success, this state machine replaces it with the mapped success step and advances to it.
 * @param entry
 * @param key
 * @param locale
 * @param action
 * @returns
 */
export async function runSubmissionStateMachine({
  entry,
  key,
  locale,
  action,
}: {
  entry: SubmissionEntry;
  key: string;
  locale: Language;
  action?: AsyncAction;
}) {
  try {
    if (!action || !(action in submitActionHandlerMap)) {
      throw new Error(ResponseMessage.FORM_HANDLER_ERROR);
    }

    const meta = getSubmissionStateMeta(entry);

    // Use the loading step mapping to determine the appropriate loading route for the current action
    const loadingPath = `/${locale}/${ASYNC_ACTION_LOADING_STEP_MAP[action]}`;

    // 1. SUCCEEDED: If submission already succeeded, redirect to success step
    if (meta.submissionState === SubmissionState.SUCCEEDED) {
      return advanceStepAndRedirect(entry, key, locale, action);
    }

    // 2. FAILED: Don't attempt to resubmit, just redirect to error page with appropriate message
    if (meta.submissionState === SubmissionState.FAILED) {
      throw new Error(ResponseMessage.SUBMISSION_FAILED);
    }

    // 3. IN_PROGRESS: If submission is in progress but not stale, redirect to loading page. If it's stale, mark as failed and redirect to error page
    if (meta.submissionState === SubmissionState.IN_PROGRESS) {
      if (!isSubmissionStateStale(meta.submissionStartedAt)) {
        return {
          redirect: {
            destination: loadingPath,
            permanent: false,
          },
        };
      }

      // Stale submission - mark as failed and redirect to error page
      entry.meta = {
        submissionState: SubmissionState.FAILED,
        responseData: {
          status: 'false',
          message: ResponseMessage.SUBMISSION_FAILED,
        },
      };
      await setStoreEntry(key, entry);
      throw new Error(ResponseMessage.SUBMISSION_FAILED);
    }

    entry.meta = {
      ...meta,
      submissionState: SubmissionState.IN_PROGRESS,
      submissionStartedAt: new Date().toISOString(),
    };
    await setStoreEntry(key, entry);
    const submitActionHandler = submitActionHandlerMap[action];
    const responseData = await submitActionHandler({ entry, locale });

    // SUCCESS: Update the entry meta to reflect successful submission and redirect to success step
    entry.meta = {
      submissionState: SubmissionState.SUCCEEDED,
      responseData,
    };
    return advanceStepAndRedirect(entry, key, locale, action);
  } catch (error) {
    // Preserve recognised response statuses; otherwise use the generic fallback.
    const allowedStatuses = new Set(Object.values(ResponseMessage));
    const status =
      error instanceof Error &&
      allowedStatuses.has(error.message as ResponseMessage)
        ? error.message
        : ResponseMessage.GENERIC_ERROR;

    // Log the error with relevant context for debugging
    console.warn(
      'Error on submit page | flow:',
      entry.data?.flow,
      '| meta:',
      entry.meta,
      error,
    );
    return {
      redirect: {
        destination: `/${locale}/${StepName.ERROR}?status=${encodeURIComponent(
          status,
        )}`,
        permanent: false,
      },
    };
  }
}
