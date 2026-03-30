import { mockSessionId } from '@maps-react/mhf/mocks';

import { SubmissionState } from '../constants';
import { SubmissionEntry } from '../types';
import {
  getSubmissionMeta,
  isStaleSubmission,
  runSubmitFlow,
} from './submitFlow';

// Minimal mocks for dependencies
const mockSetStoreEntry = jest.fn();
const mockCode = 'test-code';
const mockUrl = 'https://mock-api/submit';
const mockSubmitFlowArgs = {
  key: mockSessionId,
  lang: 'en',
  code: mockCode,
  url: mockUrl,
  entry: {} as SubmissionEntry,
};
let fetchSpy: jest.SpyInstance;

jest.mock('@maps-react/mhf/store', () => ({
  setStoreEntry: (...args: SubmissionEntry[]) => mockSetStoreEntry(...args),
}));
jest.mock('./preparePayload', () => ({ preparePayload: () => ({}) }));
globalThis.fetch = jest.fn();

describe('submitFlow utils', () => {
  beforeEach(() => {
    mockSetStoreEntry.mockClear();
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('getSubmissionMeta returns meta or default', () => {
    expect(
      getSubmissionMeta({
        meta: { submissionState: SubmissionState.SUCCEEDED },
      } as SubmissionEntry),
    ).toEqual({ submissionState: SubmissionState.SUCCEEDED });
    expect(getSubmissionMeta({} as SubmissionEntry)).toEqual({
      submissionState: SubmissionState.IDLE,
    });
  });

  it('isStaleSubmission returns true if stale', () => {
    expect(isStaleSubmission('')).toBe(false);
    expect(isStaleSubmission('invalid')).toBe(false);
    expect(isStaleSubmission(new Date(Date.now() - 31_000).toISOString())).toBe(
      true,
    );
    expect(isStaleSubmission(new Date().toISOString())).toBe(false);
  });

  it('runSubmitFlow redirects to confirmation if already succeeded', async () => {
    const entry = {
      meta: { submissionState: SubmissionState.SUCCEEDED },
      stepIndex: 0,
    } as SubmissionEntry;
    const result = await runSubmitFlow({
      ...mockSubmitFlowArgs,
      entry,
    });
    expect(result.redirect.destination).toContain('confirmation');
  });

  it('runSubmitFlow redirects to error if failed', async () => {
    const entry = {
      meta: { submissionState: SubmissionState.FAILED },
    } as SubmissionEntry;
    const result = await runSubmitFlow({
      ...mockSubmitFlowArgs,
      entry,
    });
    expect(result.redirect.destination).toContain('error');
  });

  it('runSubmitFlow redirects to loading if in progress and not stale', async () => {
    const entry = {
      meta: {
        submissionState: SubmissionState.IN_PROGRESS,
        submissionStartedAt: new Date().toISOString(),
      },
    } as SubmissionEntry;
    const result = await runSubmitFlow({
      ...mockSubmitFlowArgs,
      entry,
    });
    expect(result.redirect.destination).toContain('loading');
  });

  it('runSubmitFlow marks stale in-progress as failed and redirects to error', async () => {
    const entry = {
      meta: {
        submissionState: SubmissionState.IN_PROGRESS,
        submissionStartedAt: new Date(Date.now() - 31_000).toISOString(),
      },
    } as SubmissionEntry;
    const result = await runSubmitFlow({ ...mockSubmitFlowArgs, entry });
    expect(result.redirect.destination).toContain('error');
    expect(mockSetStoreEntry).toHaveBeenCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.FAILED,
        }),
      }),
    );
  });

  it('runSubmitFlow submits successfully from idle and redirects to confirmation', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'true', message: 'CAS-00000' }),
    });
    const entry = {
      meta: { submissionState: SubmissionState.IDLE },
      data: {},
    } as SubmissionEntry;
    const result = await runSubmitFlow({ ...mockSubmitFlowArgs, entry });
    expect(result.redirect.destination).toContain('confirmation');
    expect(mockSetStoreEntry).toHaveBeenCalled();
  });

  it('runSubmitFlow handles API non-ok and redirects to error', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ status: 'fail' }),
    });
    const entry = {
      meta: { submissionState: SubmissionState.IDLE },
      data: {},
    } as SubmissionEntry;
    const result = await runSubmitFlow({ ...mockSubmitFlowArgs, entry });
    expect(result.redirect.destination).toContain('error');
    expect(mockSetStoreEntry).toHaveBeenCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: expect.objectContaining({
          submissionState: SubmissionState.FAILED,
        }),
      }),
    );
  });

  it('runSubmitFlow handles fetch throw and redirects to error', async () => {
    fetchSpy.mockRejectedValue(new Error('fail'));
    const entry = {
      meta: { submissionState: SubmissionState.IDLE },
      data: {},
    } as SubmissionEntry;
    const result = await runSubmitFlow({ ...mockSubmitFlowArgs, entry });
    expect(result.redirect.destination).toContain('error');
  });
});
