import { NextRouter } from 'next/router';

import { createSubmitHandler } from './createSubmitHandler';

globalThis.fetch = jest.fn();

describe('createSubmitHandler', () => {
  const mockSetIsPending = jest.fn();
  const mockSetFormSummaryErrors = jest.fn();
  const mockRouterPush = jest.fn();

  const defaultConfig = {
    apiUrl: '/api/test-endpoint',
    nextStep: '/default-next-step',
    setIsPending: mockSetIsPending,
    setFormSummaryErrors: mockSetFormSummaryErrors,
    router: { push: mockRouterPush } as unknown as NextRouter,
  };

  let mockEvent: React.FormEvent<HTMLFormElement>;
  let mockForm: HTMLFormElement;

  beforeEach(() => {
    jest.clearAllMocks();

    mockForm = document.createElement('form');
    mockForm.innerHTML = `
    <input name="firstName" value="John" />
    <input name="lastName" value="Doe" />
  `;

    mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: mockForm,
      nativeEvent: {
        submitter: null,
      } as unknown as SubmitEvent,
    } as unknown as React.FormEvent<HTMLFormElement>;
  });

  it('handles a successful submission and routes to the default next step', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true }),
    });

    const handler = createSubmitHandler(defaultConfig);
    await handler(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();

    expect(mockSetIsPending).toHaveBeenCalledWith(true);
    expect(mockSetIsPending).toHaveBeenCalledWith(false);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'John', lastName: 'Doe' }),
    });

    expect(mockSetFormSummaryErrors).toHaveBeenCalledWith(null);
    expect(mockRouterPush).toHaveBeenCalledWith('/default-next-step');
  });

  it('routes to the API-provided nextPath on success if one exists', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        success: true,
        nextPath: '/api-directed-path',
      }),
    });

    const handler = createSubmitHandler(defaultConfig);
    await handler(mockEvent);

    expect(mockRouterPush).toHaveBeenCalledWith('/api-directed-path');
  });

  it('serializes multiple checkbox values with the same name as an array', async () => {
    mockForm.innerHTML = `
    <input type="checkbox" name="cover_area" value="uk_and_europe" checked />
    <input type="checkbox" name="cover_area" value="worldwide_including_us_canada" checked />
  `;

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true }),
    });

    const handler = createSubmitHandler(defaultConfig);
    await handler(mockEvent);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cover_area: ['uk_and_europe', 'worldwide_including_us_canada'],
      }),
    });
  });

  it('includes submitter button data in the payload if a specific button triggered the submit', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true }),
    });

    const mockSubmitter = document.createElement('button');
    mockSubmitter.name = 'action';
    mockSubmitter.value = 'saveAndExit';

    mockEvent = {
      ...mockEvent,
      nativeEvent: {
        submitter: mockSubmitter,
      },
    } as unknown as React.FormEvent<HTMLFormElement>;

    const handler = createSubmitHandler(defaultConfig);
    await handler(mockEvent);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          action: 'saveAndExit',
        }),
      }),
    );
  });

  it('sets form summary errors when the API returns validation errors', async () => {
    const mockFieldsError = { firstName: 'Name is required' };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        error: true,
        fields: mockFieldsError,
      }),
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });

    const handler = createSubmitHandler(defaultConfig);
    await handler(mockEvent);

    expect(mockRouterPush).not.toHaveBeenCalled();

    expect(mockSetFormSummaryErrors).toHaveBeenCalledWith(mockFieldsError);

    consoleSpy.mockRestore();
  });

  it('falls back to the default general error key when a network exception occurs', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Failure'),
    );
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });

    const handler = createSubmitHandler(defaultConfig);
    await handler(mockEvent);

    expect(mockSetFormSummaryErrors).toHaveBeenCalledWith({
      general: { error: 'general_error' },
    });
    expect(mockSetIsPending).toHaveBeenCalledWith(false);

    consoleSpy.mockRestore();
  });

  it('uses a custom fallback error key when provided during a network exception', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Failure'),
    );
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });

    const handler = createSubmitHandler({
      ...defaultConfig,
      fallbackErrorKey: 'customFieldKey',
    });

    await handler(mockEvent);

    expect(mockSetFormSummaryErrors).toHaveBeenCalledWith({
      customFieldKey: { error: 'general_error' },
    });

    consoleSpy.mockRestore();
  });
});
