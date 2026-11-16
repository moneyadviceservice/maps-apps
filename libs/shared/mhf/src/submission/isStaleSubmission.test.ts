import {
  isStaleSubmission,
  SUBMISSION_STALE_TIMEOUT_MS,
} from './isStaleSubmission';

describe('isStaleSubmission', () => {
  it('returns false when no startedAt is provided', () => {
    expect(isStaleSubmission()).toBe(false);
  });

  it('returns false for an unparsable startedAt', () => {
    expect(isStaleSubmission('not-a-date')).toBe(false);
  });

  it('returns false when within the timeout window', () => {
    expect(isStaleSubmission(new Date().toISOString())).toBe(false);
  });

  it('returns true once the timeout has elapsed', () => {
    const startedAt = new Date(
      Date.now() - SUBMISSION_STALE_TIMEOUT_MS - 1,
    ).toISOString();

    expect(isStaleSubmission(startedAt)).toBe(true);
  });
});
