import { SubmissionState } from '../constants';
import { mockEntry } from '../mocks';
import { getSubmissionMeta } from './getSubmissionMeta';

describe('getSubmissionMeta', () => {
  it('returns the entry meta when present', () => {
    const entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.SUCCEEDED },
    };

    expect(getSubmissionMeta(entry)).toEqual({
      submissionState: SubmissionState.SUCCEEDED,
    });
  });

  it('defaults to IDLE when no meta is present', () => {
    expect(getSubmissionMeta(mockEntry)).toEqual({
      submissionState: SubmissionState.IDLE,
    });
  });
});
