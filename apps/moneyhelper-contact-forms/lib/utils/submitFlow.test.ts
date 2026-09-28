import { ResponseMessage, SubmissionState } from '@maps-react/mhf/constants';
import { mockEntry, mockSessionId } from '@maps-react/mhf/mocks';
import { Entry } from '@maps-react/mhf/types';
import { type Language } from '@maps-react/utils/language';

import { runSubmitFlow } from './submitFlow';

const mockSetStoreEntry = jest.fn();
const mockCode = 'test-code';
const mockUrl = 'https://mock-api/submit';
const mockSubmitFlow = {
  key: mockSessionId,
  locale: 'en' as Language,
  code: mockCode,
  url: mockUrl,
  entry: {} as Entry,
};
let fetchSpy: jest.SpyInstance;

jest.mock('@maps-react/mhf/store', () => ({
  // clone args: entry is mutated further after this call, so the mock must snapshot it
  setStoreEntry: (key: string, entry: unknown) =>
    mockSetStoreEntry(key, JSON.parse(JSON.stringify(entry))),
}));
jest.mock('./preparePayload', () => ({ preparePayload: () => ({}) }));
globalThis.fetch = jest.fn();

describe('runSubmitFlow', () => {
  beforeEach(() => {
    mockSetStoreEntry.mockClear();
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('submits the prepared payload and redirects to confirmation', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ status: true, message: 'CAS-00000' }),
    } as Response);

    const entry = {
      ...mockEntry,
      meta: { submissionState: SubmissionState.IDLE },
    };

    const result = await runSubmitFlow({
      ...mockSubmitFlow,
      entry,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      `${mockUrl}?code=${mockCode}`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      }),
    );
    expect(mockSetStoreEntry).toHaveBeenLastCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: {
          submissionState: SubmissionState.SUCCEEDED,
          responseData: { status: true, message: 'CAS-00000' },
          submissionKey: 'contact-submit',
        },
      }),
    );
    expect(result.redirect.destination).toContain('confirmation');
  });

  it('redirects with the API error status when the API rejects the request', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      json: async () => ({ status: false, message: 101 }),
    } as Response);

    const result = await runSubmitFlow({
      ...mockSubmitFlow,
      entry: {
        ...mockEntry,
        meta: { submissionState: SubmissionState.IDLE },
      },
    });

    expect(mockSetStoreEntry).toHaveBeenLastCalledWith(
      mockSessionId,
      expect.objectContaining({
        ...mockEntry,
        meta: {
          submissionState: SubmissionState.FAILED,
          submissionKey: 'contact-submit',
          submissionErrorStatus: '101',
        },
      }),
    );
    expect(result.redirect.destination).toContain('status=101');
  });

  it('uses the generic error status for network failures', async () => {
    fetchSpy.mockRejectedValue(new Error('Failed to fetch'));

    const result = await runSubmitFlow({
      ...mockSubmitFlow,
      entry: {
        ...mockEntry,
        meta: { submissionState: SubmissionState.IDLE },
      },
    });
    expect(mockSetStoreEntry).toHaveBeenLastCalledWith(
      mockSessionId,
      expect.objectContaining({
        meta: {
          submissionState: SubmissionState.FAILED,
          submissionKey: 'contact-submit',
          submissionErrorStatus: '103',
        },
      }),
    );

    expect(result.redirect.destination).toContain(
      `status=${ResponseMessage.GENERIC_ERROR}`,
    );
  });
});
