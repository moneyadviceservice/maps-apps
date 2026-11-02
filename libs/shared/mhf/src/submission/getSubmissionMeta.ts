import { SubmissionState } from '../constants';
import { Entry, SubmissionMeta } from '../types';

/**
 * Retrieves the submission meta from the store entry, or returns a default meta if not present.
 * @param entry
 * @returns
 */
export const getSubmissionMeta = (entry: Entry): SubmissionMeta =>
  entry.meta ?? { submissionState: SubmissionState.IDLE };
