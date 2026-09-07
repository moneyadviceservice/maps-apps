import { useRouter } from 'next/router';

import { useErrorSummary } from 'hooks/useErrorSummary';
import { mockJsonFetchResponse } from 'lib/fca/testing/mockJsonFetchResponse';
import { waitFor } from '@testing-library/react';

export function setupAccountFormComponentTest() {
  const mockPush = jest.fn();
  const mockSetFormSummaryErrors = jest.fn();
  const mockSetSubmittedEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useErrorSummary as jest.Mock).mockReturnValue({
      setFormSummaryErrors: mockSetFormSummaryErrors,
      setSubmittedEmail: mockSetSubmittedEmail,
      errorSummarySection: null,
      fieldErrors: null,
    });
  });

  return { mockPush, mockSetFormSummaryErrors, mockSetSubmittedEmail };
}

export function mockAccountFormFetchSuccess(nextPath?: string) {
  const body = nextPath ? { success: true, nextPath } : { success: true };
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockJsonFetchResponse(body),
  );
}

export function mockAccountFormFetchValidationError(
  fields: Record<string, unknown>,
) {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
    mockJsonFetchResponse({ error: true, fields }),
  );
}

export async function expectAccountFormApiSubmit({
  apiUrl,
  expectedBody,
  nextPath,
  mockPush,
}: {
  apiUrl: string;
  expectedBody: Record<string, unknown>;
  nextPath: string;
  mockPush: jest.Mock;
}) {
  await waitFor(() => {
    const [, requestInit] = (globalThis.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(requestInit.body as string);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      apiUrl,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(body).toEqual(expect.objectContaining(expectedBody));
    expect(mockPush).toHaveBeenCalledWith(nextPath);
  });
}
