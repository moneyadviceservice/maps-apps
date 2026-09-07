import { setStoreEntry } from '@maps-react/mhf/store';
import { Language } from '@maps-react/mhf/utils';

import { ResponseMessage, StepName, SubmissionState } from '../constants';
import { ResponseData, SubmissionEntry, SubmissionMeta } from '../types';
import { preparePayload } from './preparePayload';

const SUBMISSION_STALE_TIMEOUT_MS = 30_000;

/**
 * Retrieves the submission meta from the store entry, or returns a default meta if not present.
 * @param entry
 * @returns
 */
export const getSubmissionMeta = (entry: SubmissionEntry): SubmissionMeta =>
  entry.meta ?? { submissionState: SubmissionState.IDLE };

/**
 * Determines if a submission in progress has become stale based on its startedAt timestamp.
 * Stale = submission has been in progress for longer than the defined timeout, which likely indicates an issue with the submission process (e.g., user closed the tab, network error) and prevents indefinite blocking of the flow.
 * @param startedAt
 * @returns
 */
export const isStaleSubmission = (startedAt?: string): boolean => {
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
 * Increments the step index and redirects to the confirmation page.
 * @param entry
 * @param key
 * @param locale
 * @returns
 */
export async function incrementAndRedirectToConfirmation(
  entry: SubmissionEntry,
  key: string,
  locale: Language,
) {
  entry.stepIndex++;
  await setStoreEntry(key, entry);

  return {
    redirect: {
      destination: `/${locale}/${StepName.CONFIRMATION}`,
      permanent: false,
    },
  };
}

/**
 * Main function to handle the submission flow logic, including checking submission state, making the API call, and updating the store entry accordingly.
 * @param entry
 * @param key
 * @param locale
 * @param code
 * @param url
 * @returns
 */
export async function runSubmitFlow({
  entry,
  key,
  locale,
  code,
  url,
}: {
  entry: SubmissionEntry;
  key: string;
  locale: Language;
  code: string;
  url: string;
}) {
  let responseData = {} as ResponseData;

  try {
    const meta = getSubmissionMeta(entry);

    // 1. SUCCEEDED: If submission already succeeded, redirect to confirmation
    if (meta.submissionState === SubmissionState.SUCCEEDED) {
      return incrementAndRedirectToConfirmation(entry, key, locale);
    }

    // 2. FAILED: Don't attempt to resubmit, just redirect to error page with appropriate message
    if (meta.submissionState === SubmissionState.FAILED) {
      throw new Error(ResponseMessage.SUBMISSION_FAILED);
    }

    // 3. IN_PROGRESS: If submission is in progress but not stale, redirect to loading page. If it's stale, mark as failed and redirect to error page
    if (meta.submissionState === SubmissionState.IN_PROGRESS) {
      if (!isStaleSubmission(meta.submissionStartedAt)) {
        return {
          redirect: {
            destination: `/${locale}/${StepName.LOADING}`,
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
    const payload = preparePayload(entry.data);
    const response = await fetch(`${url}?code=${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    responseData = await response.json();

    if (!response.ok) {
      entry.meta = {
        submissionState: SubmissionState.FAILED,
        responseData,
      };
      await setStoreEntry(key, entry);
      throw new Error(String(responseData.message));
    }

    // SUCCESS: Update the entry meta to reflect successful submission and redirect to confirmation
    entry.meta = {
      submissionState: SubmissionState.SUCCEEDED,
      responseData,
    };
    return incrementAndRedirectToConfirmation(entry, key, locale);
  } catch (error) {
    // Ensure any error thrown is an instance of Error and matches the regex ('100'- '105') to determine the status code, otherwise default to the value of GENERIC_ERROR
    const status =
      error instanceof Error && /^\d+$/.test(error.message)
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
        destination: `./${StepName.ERROR}?status=${encodeURIComponent(status)}`,
        permanent: false,
      },
    };
  }
}
