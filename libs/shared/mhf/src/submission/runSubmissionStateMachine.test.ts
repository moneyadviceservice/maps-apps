import { Language } from '@maps-react/utils/language';

import { ResponseMessage, SubmissionState } from '../constants';
import { mockEntry, mockSessionId } from '../mocks';
import { Entry } from '../types';
import { isStaleSubmission } from './isStaleSubmission';
import { runSubmissionStateMachine } from './runSubmissionStateMachine';

const mockSetStoreEntry = jest.fn();
jest.mock('../store', () => ({
  setStoreEntry: (key: string, entry: unknown) =>
    mockSetStoreEntry(key, JSON.parse(JSON.stringify(entry))),
}));
jest.mock('./isStaleSubmission', () => ({
  isStaleSubmission: jest.fn(),
}));

const mockOnSuccess = jest.fn(async () => ({
  redirect: { destination: '/en/confirmation', permanent: false as const },
}));
const mockOnError = jest.fn();

const baseOptions = {
  key: mockSessionId,
  locale: 'en' as Language,
  submissionKey: 'contact-submit',
  loadingDestination: '/en/loading',
  errorDestination: (status: string) => `/en/error?status=${status}`,
  resolveErrorStatus: (error: unknown) =>
    error instanceof Error ? error.message : ResponseMessage.GENERIC_ERROR,
  onSuccess: mockOnSuccess,
  onError: mockOnError,
};

describe('runSubmissionStateMachine', () => {
  beforeEach(() => {
    mockSetStoreEntry.mockClear();
    mockOnSuccess.mockClear();
    mockOnError.mockClear();
    jest.mocked(isStaleSubmission).mockReturnValue(false);
  });

  it('hands off to onSuccess without resubmitting when already SUCCEEDED', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.SUCCEEDED },
    };
    const submit = jest.fn();

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).not.toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalledWith(entry, mockSessionId, 'en');
    expect(result.redirect.destination).toBe('/en/confirmation');
  });

  it('redirects to error without resubmitting when already FAILED', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.FAILED },
    };
    const submit = jest.fn();

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).not.toHaveBeenCalled();
    expect(result.redirect.destination).toBe(
      `/en/error?status=${ResponseMessage.SUBMISSION_FAILED}`,
    );
  });

  it('redirects to loading for a fresh IN_PROGRESS submission', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: {
        submissionState: SubmissionState.IN_PROGRESS,
      },
    };
    const submit = jest.fn();

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).not.toHaveBeenCalled();
    expect(result.redirect.destination).toBe('/en/loading');
  });

  it('marks a stale IN_PROGRESS submission as FAILED and redirects to error', async () => {
    jest.mocked(isStaleSubmission).mockReturnValue(true);
    const entry: Entry = {
      ...mockEntry,
      meta: {
        submissionState: SubmissionState.IN_PROGRESS,
      },
    };
    const submit = jest.fn();

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).not.toHaveBeenCalled();
    expect(mockSetStoreEntry).toHaveBeenCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.FAILED,
        }),
      }),
    );
    expect(result.redirect.destination).toBe(
      `/en/error?status=${ResponseMessage.SUBMISSION_FAILED}`,
    );
  });

  it('persists IN_PROGRESS before submitting and SUCCEEDED before onSuccess', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.IDLE },
    };

    const submit = jest.fn(async () => {
      expect(mockSetStoreEntry).toHaveBeenCalledTimes(1);
      expect(mockSetStoreEntry).toHaveBeenNthCalledWith(
        1,
        mockSessionId,
        expect.objectContaining({
          meta: expect.objectContaining({
            submissionState: SubmissionState.IN_PROGRESS,
          }),
        }),
      );

      return { status: true, message: 'ok' };
    });

    const onSuccess = jest.fn(async () => {
      expect(mockSetStoreEntry).toHaveBeenLastCalledWith(
        mockSessionId,
        expect.objectContaining({
          meta: expect.objectContaining({
            submissionState: SubmissionState.SUCCEEDED,
          }),
        }),
      );

      return {
        redirect: {
          destination: '/en/confirmation',
          permanent: false as const,
        },
      };
    });

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
      onSuccess,
    });

    expect(submit).toHaveBeenCalledWith(entry);
    expect(onSuccess).toHaveBeenCalledWith(entry, mockSessionId, 'en');
    expect(result.redirect.destination).toBe('/en/confirmation');
  });

  it('marks the submission FAILED and redirects when submit throws', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.IDLE },
    };
    const submit = jest.fn(async () => {
      throw new Error('101');
    });

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(mockSetStoreEntry).toHaveBeenLastCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.FAILED,
          submissionErrorStatus: '101',
        }),
      }),
    );
    expect(result.redirect.destination).toBe('/en/error?status=101');
  });
});
