import { type Language } from '@maps-react/utils/language';

import { ResponseMessage, SubmissionState } from '../constants';
import { setStoreEntry } from '../store';
import { Entry, ResponseData } from '../types';
import { getSubmissionMeta } from './getSubmissionMeta';
import { isStaleSubmission } from './isStaleSubmission';

export type SubmissionResult = {
  redirect: { destination: string; permanent: false };
};

export type RunSubmissionStateMachineOptions = {
  entry: Entry;
  key: string;
  locale: Language;
  /** Unique key representing the submission, typically a hash of the request body. */
  submissionKey: string;
  /** Route shown while a fresh (non-stale) submission is IN_PROGRESS. */
  loadingDestination: string;
  /** Builds the error route for a resolved status code. */
  errorDestination: (status: string) => string;
  /** Maps a thrown error to the status code used by errorDestination. */
  resolveErrorStatus: (error: unknown) => string;
  /** Performs the API call; throw to fail the submission. */
  submit: (entry: Entry) => Promise<ResponseData>;
  /** Called once a submission has SUCCEEDED; owns step advance + destination. */
  onSuccess: (
    entry: Entry,
    key: string,
    locale: Language,
  ) => Promise<SubmissionResult>;
  /** Defaults to console.warn; override to customize logging context. */
  onError?: (error: unknown, entry: Entry) => void;
};

const defaultOnError = (error: unknown, entry: Entry) =>
  console.warn(
    'Error on submission | flow:',
    entry.data?.flow,
    '| meta:',
    entry.meta,
    error,
  );

/**
 * Shared IDLE -> IN_PROGRESS -> SUCCEEDED | FAILED submission orchestration.
 * Apps supply the API call, success routing, and error status/route mapping.
 * @returns {Promise<SubmissionResult>} The result of the submission state machine.
 */
export async function runSubmissionStateMachine({
  entry,
  key,
  locale,
  submissionKey,
  loadingDestination,
  errorDestination,
  resolveErrorStatus,
  submit,
  onSuccess,
  onError = defaultOnError,
}: RunSubmissionStateMachineOptions): Promise<SubmissionResult> {
  try {
    // Retrieve the current submission metadata and determine if it belongs to the same session. If not, set to IDLE in preparation for a new submission.
    let meta = getSubmissionMeta(entry);
    const isSameSession =
      !meta.submissionKey || meta.submissionKey === submissionKey;

    if (!isSameSession) {
      meta = {
        submissionState: SubmissionState.IDLE,
        submissionKey,
      };
      entry.meta = meta;
    }

    // SUCCEEDED: don't resubmit, hand off to the app's success routing
    if (meta.submissionState === SubmissionState.SUCCEEDED) {
      return await onSuccess(entry, key, locale);
    }

    // FAILED: don't resubmit
    if (meta.submissionState === SubmissionState.FAILED) {
      throw new Error(
        meta.submissionErrorStatus ?? ResponseMessage.SUBMISSION_FAILED,
      );
    }

    // IN_PROGRESS: redirect to loading while fresh, otherwise mark failed
    if (meta.submissionState === SubmissionState.IN_PROGRESS) {
      if (!isStaleSubmission(meta.submissionStartedAt)) {
        return {
          redirect: { destination: loadingDestination, permanent: false },
        };
      }
      entry.meta = {
        submissionState: SubmissionState.FAILED,
        submissionStartedAt: undefined,
        submissionKey,
      };
      await setStoreEntry(key, entry);
      throw new Error(ResponseMessage.SUBMISSION_FAILED);
    }

    entry.meta = {
      ...meta,
      submissionState: SubmissionState.IN_PROGRESS,
      submissionStartedAt: new Date().toISOString(),
      submissionKey,
    };
    await setStoreEntry(key, entry);

    const responseData = await submit(entry);
    entry.meta = {
      submissionState: SubmissionState.SUCCEEDED,
      responseData,
      submissionKey,
    };
    return await onSuccess(entry, key, locale);
  } catch (error) {
    const status = resolveErrorStatus(error);
    // Only a submit() failure needs a fresh FAILED write; the FAILED/stale branches above already persisted.
    if (entry.meta?.submissionState === SubmissionState.IN_PROGRESS) {
      entry.meta = {
        submissionState: SubmissionState.FAILED,
        submissionStartedAt: undefined,
        submissionKey,
        submissionErrorStatus: status,
      };
      await setStoreEntry(key, entry);
    }

    onError(error, entry);
    return {
      redirect: {
        destination: errorDestination(status),
        permanent: false,
      },
    };
  }
}
