export const SUBMISSION_STALE_TIMEOUT_MS = 30_000;

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

  return Date.now() - startedAtMs > SUBMISSION_STALE_TIMEOUT_MS;
};
