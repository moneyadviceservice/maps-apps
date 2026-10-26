import { ResponseMessage } from '@maps-react/mhf/constants';
import { setStoreEntry } from '@maps-react/mhf/store';
import {
  runSubmissionStateMachine,
  SubmissionResult,
} from '@maps-react/mhf/submission';
import { Entry } from '@maps-react/mhf/types';
import { type Language } from '@maps-react/utils/language';

import { StepName } from '../constants';
import { ContactResponseData } from '../types';
import { preparePayload } from './preparePayload';

/**
 * Main function to handle the submission flow logic, delegating orchestration to the shared state machine.
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
  entry: Entry;
  key: string;
  locale: Language;
  code: string;
  url: string;
}) {
  return runSubmissionStateMachine({
    entry,
    key,
    locale,
    submissionKey: 'contact-submit',
    loadingDestination: `/${locale}/${StepName.LOADING}`,
    errorDestination: (status: string) =>
      `/${locale}/${StepName.ERROR}?status=${encodeURIComponent(status)}`,
    resolveErrorStatus: (error: unknown) =>
      error instanceof Error && /^\d+$/.test(error.message)
        ? error.message
        : ResponseMessage.GENERIC_ERROR,
    submit: (entry) => submit(entry, url, code),
    onSuccess: incrementAndRedirectToConfirmation,
  });
}

/**
 * Submits the prepared payload to the specified URL with the given code.
 * @param entry The submission entry containing the data to be submitted.
 * @param url The URL to which the payload should be submitted.
 * @param code The code to be included as a query parameter in the submission URL.
 * @returns The response data from the submission.
 */
async function submit(
  entry: Entry,
  url: string,
  code: string,
): Promise<ContactResponseData> {
  const payload = preparePayload(entry.data);
  const response = await fetch(`${url}?code=${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseData: ContactResponseData = await response.json();

  if (!response.ok) {
    // Convert the response message to a string and throw as an error
    throw new Error(String(responseData.message));
  }

  return responseData;
}

/**
 * Increments the step index and redirects to the confirmation page.
 * @param entry
 * @param key
 * @param locale
 * @returns
 */
export async function incrementAndRedirectToConfirmation(
  entry: Entry,
  key: string,
  locale: Language,
): Promise<SubmissionResult> {
  entry.stepIndex++;
  await setStoreEntry(key, entry);

  return {
    redirect: {
      destination: `/${locale}/${StepName.CONFIRMATION}`,
      permanent: false,
    },
  };
}
