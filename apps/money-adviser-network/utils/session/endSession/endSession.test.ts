/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

import { endSession } from './endSession';

describe('endSession', () => {
  const mockUrl = 'https://example.com/some/page';

  const createRequest = (cookies: Record<string, string>) => {
    return {
      url: mockUrl,
      cookies: {
        get: (key: string) =>
          cookies[key] ? { name: key, value: cookies[key] } : undefined,
      },
    } as unknown as NextRequest;
  };

  it('should delete only the session cookie and redirect', () => {
    const request = createRequest({ session: 'abc123' });

    const response = endSession(request);

    expect(response.status).toBe(302);

    expect(response.headers.get('location')).toBe('https://example.com/');

    const setCookies = response.headers.getSetCookie();

    expect(setCookies.some((c) => c.startsWith('session=;'))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('csrfToken='))).toBe(false);
  });

  it('should delete both session and csrfToken cookies when present', () => {
    const request = createRequest({
      session: 'abc123',
      csrfToken: 'xyz987',
    });

    const response = endSession(request);

    const setCookies = response.headers.getSetCookie();

    expect(setCookies.some((c) => c.startsWith('session=;'))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('csrfToken=;'))).toBe(true);
  });
});
