import { ResponseMessage, SubmissionState } from '../constants';
import { mockEntry, mockSessionId } from '../mocks';
import { Entry } from '../types';
import { runSubmissionStateMachine } from './runSubmissionStateMachine';

const mockSetStoreEntry = jest.fn();
jest.mock('../store', () => ({
  // clone args: entry is mutated further after this call, so the mock must snapshot it
  setStoreEntry: (key: string, entry: unknown) =>
    mockSetStoreEntry(key, JSON.parse(JSON.stringify(entry))),
}));

const mockOnSuccess = jest.fn(async () => ({
  redirect: { destination: '/en/confirmation', permanent: false as const },
}));
const mockOnError = jest.fn();

const baseOptions = {
  key: mockSessionId,
  locale: 'en' as const,
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

  it('starts a new submission when the submission key changes', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: {
        submissionState: SubmissionState.SUCCEEDED,
        submissionKey: 'previous-submit',
        responseData: { status: true, message: 'old result' },
      },
    };
    const submit = jest.fn(async () => ({
      status: true,
      message: 'new result',
    }));

    await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).toHaveBeenCalledWith(entry);
    expect(mockSetStoreEntry).toHaveBeenNthCalledWith(
      1,
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.IN_PROGRESS,
          submissionKey: 'contact-submit',
        }),
      }),
    );
    expect(entry.meta).toEqual({
      submissionState: SubmissionState.SUCCEEDED,
      responseData: { status: true, message: 'new result' },
      submissionKey: 'contact-submit',
    });
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
    expect(mockSetStoreEntry).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalled();
    expect(result.redirect.destination).toBe(
      `/en/error?status=${ResponseMessage.SUBMISSION_FAILED}`,
    );
  });

  it('redirects to loading when IN_PROGRESS and not stale', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: {
        submissionState: SubmissionState.IN_PROGRESS,
        submissionStartedAt: new Date().toISOString(),
      },
    };
    const submit = jest.fn();

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).not.toHaveBeenCalled();
    expect(mockSetStoreEntry).not.toHaveBeenCalled();
    expect(result.redirect.destination).toBe('/en/loading');
  });

  it('marks a stale IN_PROGRESS submission as FAILED and redirects to error', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: {
        submissionState: SubmissionState.IN_PROGRESS,
        submissionStartedAt: new Date(Date.now() - 31_000).toISOString(),
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

  it('submits from IDLE and hands off to onSuccess on success', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: {
        submissionState: SubmissionState.IDLE,
        responseData: { status: false, message: 'old result' },
      },
    };
    const submit = jest.fn(async () => ({ status: true, message: 'ok' }));

    const result = await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).toHaveBeenCalledWith(entry);
    expect(entry.meta).toEqual({
      submissionState: SubmissionState.SUCCEEDED,
      responseData: { status: true, message: 'ok' },
      submissionKey: 'contact-submit',
    });
    expect(mockSetStoreEntry).toHaveBeenLastCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.IN_PROGRESS,
          submissionKey: 'contact-submit',
        }),
      }),
    );
    expect(mockOnSuccess).toHaveBeenCalledWith(entry, mockSessionId, 'en');
    expect(result.redirect.destination).toBe('/en/confirmation');
  });

  it('defaults to IDLE for an entry with no meta at all', async () => {
    const entry: Entry = { ...mockEntry };
    const submit = jest.fn(async () => ({ status: 'true', message: 'ok' }));

    await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(submit).toHaveBeenCalledWith(entry);
  });

  it('marks FAILED and redirects to error when submit throws', async () => {
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

    expect(mockSetStoreEntry).toHaveBeenCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.FAILED,
        }),
      }),
    );
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), entry);
    expect(result.redirect.destination).toBe('/en/error?status=101');
  });

  it('persists the IN_PROGRESS state before attempting submit', async () => {
    const entry: Entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.IDLE },
    };
    const submit = jest.fn(async () => ({ status: 'true', message: 'ok' }));

    await runSubmissionStateMachine({
      ...baseOptions,
      entry,
      submit,
    });

    expect(mockSetStoreEntry).toHaveBeenNthCalledWith(
      1,
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.IN_PROGRESS,
        }),
      }),
    );
    expect(mockSetStoreEntry).toHaveBeenLastCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.IN_PROGRESS,
          submissionKey: 'contact-submit',
        }),
      }),
    );
  });

  it('uses the default onError logger when none is provided', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
      /* empty */
    });
    const entry: Entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.FAILED },
    };
    const { onError: _onError, ...optionsWithoutOnError } = baseOptions;

    await runSubmissionStateMachine({
      ...optionsWithoutOnError,
      entry,
      submit: jest.fn(),
    });

    expect(warnSpy).toHaveBeenCalledWith(
      'Error on submission | flow:',
      entry.data?.flow,
      '| meta:',
      entry.meta,
      expect.any(Error),
    );
    warnSpy.mockRestore();
  });
});
