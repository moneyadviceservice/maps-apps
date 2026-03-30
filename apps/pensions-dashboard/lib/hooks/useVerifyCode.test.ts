import type { FormEvent } from 'react';

import { useRouter } from 'next/router';

import { act, renderHook } from '@testing-library/react';

import { useVerifyCode } from './useVerifyCode';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockUseRouter = useRouter as jest.Mock;

function mockFetchJson(
  body: object,
  init?: { status?: number; ok?: boolean },
): void {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: async () => body,
  });
}

function mockFetchInvalidJson(): void {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('invalid json');
    },
  });
}

describe('useVerifyCode', () => {
  const linkId = 'test-link-id';
  let router: {
    isReady: boolean;
    query: Record<string, string | string[] | undefined>;
  };
  const originalLocationDescriptor = Object.getOwnPropertyDescriptor(
    window,
    'location',
  );

  beforeEach(() => {
    router = { isReady: true, query: {} };
    mockUseRouter.mockReturnValue(router);
    global.fetch = jest.fn();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (originalLocationDescriptor) {
      Object.defineProperty(window, 'location', originalLocationDescriptor);
    }
  });

  it('initialises with empty code and no error', () => {
    const { result } = renderHook(() => useVerifyCode(linkId));

    expect(result.current.code).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.resendLoading).toBe(false);
    expect(result.current.resendSuccess).toBe(false);
  });

  it('does not read sendError until router is ready', () => {
    router.isReady = false;
    router.query = { sendError: 'too-many-attempts' };

    const { result, rerender } = renderHook(() => useVerifyCode(linkId));

    expect(result.current.error).toBeNull();

    router.isReady = true;
    rerender();

    expect(result.current.error).toBe('too-many-attempts');
  });

  it('sets too-many-attempts from sendError query (string)', () => {
    router.query = { sendError: 'too-many-attempts' };

    const { result } = renderHook(() => useVerifyCode(linkId));

    expect(result.current.error).toBe('too-many-attempts');
    expect(result.current.errorMessage).toBe(
      'pages.verify-code.error-too-many-attempts',
    );
  });

  it('sets too-many-attempts from sendError when query value is an array', () => {
    router.query = { sendError: ['too-many-attempts'] };

    const { result } = renderHook(() => useVerifyCode(linkId));

    expect(result.current.error).toBe('too-many-attempts');
  });

  it('handleCodeChange keeps digits only and caps at 6', () => {
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('12a34b56c78');
    });
    expect(result.current.code).toBe('123456');
  });

  it('handleCodeChange clears a previous error', () => {
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });
    expect(result.current.error).toBe('empty');

    act(() => {
      result.current.handleCodeChange('99');
    });
    expect(result.current.error).toBeNull();
    expect(result.current.code).toBe('99');
  });

  it('handleSubmit sets empty error when code is blank', async () => {
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe('empty');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handleSubmit sets invalid-length when code is not 6 digits', async () => {
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('12345');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe('invalid-length');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handleSubmit redirects to API redirect URL', async () => {
    mockFetchJson({ redirect: 'https://example.com/after' });
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('123456');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(window.location.href).toBe('https://example.com/after');
    expect(result.current.loading).toBe(false);
  });

  it('handleSubmit redirects home on success', async () => {
    mockFetchJson({ success: true });
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('123456');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(window.location.href).toBe('/');
  });

  it.each([
    ['invalid', 'invalid'],
    ['too-many-attempts', 'too-many-attempts'],
    ['expired', 'expired'],
    ['api-failure', 'api-failure'],
  ] as const)('handleSubmit maps API error %s', async (apiError, expected) => {
    mockFetchJson({ success: false, error: apiError });
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('123456');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe(expected);
  });

  it('handleSubmit sets api-failure when response JSON is invalid', async () => {
    mockFetchInvalidJson();
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('123456');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe('api-failure');
    expect(result.current.loading).toBe(false);
  });

  it('handleSubmit sets api-failure when fetch throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'));
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('123456');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(result.current.error).toBe('api-failure');
  });

  it('handleSubmit posts linkId and code', async () => {
    mockFetchJson({ success: true });
    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('654321');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId, code: '654321' }),
    });
  });

  it('handleResend sets success when API succeeds', async () => {
    mockFetchJson({ success: true });
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(result.current.resendSuccess).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.resendLoading).toBe(false);
  });

  it('handleCodeChange clears resend success after resend', async () => {
    mockFetchJson({ success: true });
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });
    expect(result.current.resendSuccess).toBe(true);

    act(() => {
      result.current.handleCodeChange('1');
    });
    expect(result.current.resendSuccess).toBe(false);
  });

  it('handleSubmit clears resend success after resend', async () => {
    mockFetchJson({ success: true });
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });
    expect(result.current.resendSuccess).toBe(true);

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });
    expect(result.current.resendSuccess).toBe(false);
    expect(result.current.error).toBe('empty');
  });

  it('handleResend redirects when API returns redirect', async () => {
    mockFetchJson({ redirect: 'https://example.com/r' });
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(window.location.href).toBe('https://example.com/r');
  });

  it('handleResend requests encoded linkId', async () => {
    mockFetchJson({ success: true });
    const id = 'a/b c';
    const { result } = renderHook(() => useVerifyCode(id));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/resend?linkId=${encodeURIComponent(id)}`,
    );
  });

  it('handleResend sets too-many-attempts from error field', async () => {
    mockFetchJson({ success: false, error: 'too-many-attempts' });
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(result.current.error).toBe('too-many-attempts');
  });

  it('handleResend sets too-many-attempts on 429', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ success: false }),
    });
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(result.current.error).toBe('too-many-attempts');
  });

  it('handleResend sets api-failure for other failures', async () => {
    mockFetchJson({ success: false, error: 'other' });
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(result.current.error).toBe('api-failure');
  });

  it('handleResend sets api-failure when JSON parse fails', async () => {
    mockFetchInvalidJson();
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(result.current.error).toBe('api-failure');
    expect(result.current.resendLoading).toBe(false);
  });

  it('handleResend sets api-failure when fetch throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'));
    const { result } = renderHook(() => useVerifyCode(linkId));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(result.current.error).toBe('api-failure');
  });

  it('handleSubmit sets loading false in finally after success', async () => {
    let resolveJson!: (v: object) => void;
    const jsonPromise = new Promise<object>((resolve) => {
      resolveJson = resolve;
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => jsonPromise,
    });

    const { result } = renderHook(() => useVerifyCode(linkId));

    act(() => {
      result.current.handleCodeChange('123456');
    });

    let submitPromise!: Promise<void>;
    act(() => {
      submitPromise = result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveJson({ success: true });
      await submitPromise;
    });

    expect(result.current.loading).toBe(false);
  });
});
