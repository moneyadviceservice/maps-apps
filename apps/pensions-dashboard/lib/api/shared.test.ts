import {
  DATA_NOT_FOUND,
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_ACCEPTED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import {
  serviceDeleteRequest,
  serviceGetRequest,
  servicePostRequest,
} from './shared';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

function headersWithSetCookie(cookieValue: string | null) {
  return {
    get: (name: string) =>
      name.toLowerCase() === 'set-cookie' ? cookieValue : null,
  };
}

function mockCsrfResponse(options: {
  ok?: boolean;
  status?: number;
  cookieHeader?: string | null;
}) {
  const { ok = true, status = 200, cookieHeader } = options;
  mockFetch.mockResolvedValueOnce({
    ok,
    status,
    headers: headersWithSetCookie(
      cookieHeader === undefined
        ? 'X-XSRF-TOKEN=csrf-val; Path=/'
        : cookieHeader,
    ),
  });
}

describe('shared service helpers', () => {
  const originalEnv = process.env;
  const baseUrl = 'https://svc.example.com';
  const sessionId = 'session-1';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => null);
    jest.spyOn(console, 'warn').mockImplementation(() => null);
    process.env = { ...originalEnv, MHPD_ISS: 'iss-token' };
    mockFetch.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe('serviceGetRequest', () => {
    it('returns parsed JSON when GET succeeds', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      const data = await serviceGetRequest<{ id: number }>({
        serviceUrl: baseUrl,
        endpoint: '/data',
        userSessionId: sessionId,
      });

      expect(data).toEqual({ id: 1 });
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/data`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            userSessionId: sessionId,
            mhpdCorrelationId: sessionId,
          }),
        }),
      );
    });

    it('merges additionalHeaders', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await serviceGetRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        additionalHeaders: { 'X-Custom': '1' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'X-Custom': '1' }),
        }),
      );
    });

    it('throws when includeIss is true and MHPD_ISS is unset', async () => {
      delete process.env.MHPD_ISS;

      await expect(
        serviceGetRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          includeIss: true,
        }),
      ).rejects.toThrow(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('adds iss header when includeIss and MHPD_ISS are set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      await serviceGetRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        includeIss: true,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ iss: 'iss-token' }),
        }),
      );
    });

    it('does not require ISS when includeIss is false', async () => {
      delete process.env.MHPD_ISS;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ a: 1 }),
      });

      await expect(
        serviceGetRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          includeIss: false,
        }),
      ).resolves.toEqual({ a: 1 });
    });

    it('throws SESSION_EXPIRED when isSessionExpired returns true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await expect(
        serviceGetRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          sessionStart: 't0',
          isSessionExpired: async () => true,
        }),
      ).rejects.toThrow(SESSION_EXPIRED);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('continues when sessionStart is set but isSessionExpired is omitted', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      await serviceGetRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        sessionStart: 't0',
      });

      expect(mockFetch).toHaveBeenCalled();
    });

    it('continues when isSessionExpired returns false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      await serviceGetRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        sessionStart: 't0',
        isSessionExpired: async () => false,
      });

      expect(mockFetch).toHaveBeenCalled();
    });

    it('throws RESPONSE_NOT_OK when HTTP response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(
        serviceGetRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
        }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('throws DATA_NOT_FOUND when JSON is null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      await expect(
        serviceGetRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
        }),
      ).rejects.toThrow(DATA_NOT_FOUND);
    });

    it('logs and rethrows when fetch fails', async () => {
      const err = new Error('net');
      mockFetch.mockRejectedValueOnce(err);

      await expect(
        serviceGetRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
        }),
      ).rejects.toThrow('net');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, err);
    });

    it('logs and rethrows when response.json fails', async () => {
      const err = new SyntaxError('bad json');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw err;
        },
      });

      await expect(
        serviceGetRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
        }),
      ).rejects.toThrow(err);

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, err);
    });
  });

  describe('servicePostRequest', () => {
    it('completes POST with CSRF flow and default ok status', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ saved: true }),
      });

      const out = await servicePostRequest<{ saved: boolean }>({
        serviceUrl: baseUrl,
        endpoint: '/save',
        userSessionId: sessionId,
        body: { a: 1 },
      });

      expect(out).toEqual({ saved: true });
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        `${baseUrl}/csrf-token`,
        expect.objectContaining({ method: 'GET' }),
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        `${baseUrl}/save`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-XSRF-TOKEN': 'csrf-val',
            iss: 'iss-token',
          }),
          body: JSON.stringify({ a: 1 }),
        }),
      );
    });

    it('throws when requiresIss is true and MHPD_ISS is unset', async () => {
      delete process.env.MHPD_ISS;

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
        }),
      ).rejects.toThrow(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('omits ISS when requiresIss is false', async () => {
      delete process.env.MHPD_ISS;
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await servicePostRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        body: {},
        requiresIss: false,
      });

      const postCall = mockFetch.mock.calls[1];
      expect(postCall[1].headers).not.toHaveProperty('iss');
    });

    it('validates expectedStatus created (201)', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 'new' }),
      });

      const out = await servicePostRequest<{ id: string }>({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        body: {},
        expectedStatus: 'created',
      });

      expect(out).toEqual({ id: 'new' });
    });

    it('validates expectedStatus accepted (202)', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 202,
        json: async () => ({ queued: true }),
      });

      const out = await servicePostRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        body: {},
        expectedStatus: 'accepted',
      });

      expect(out).toEqual({ queued: true });
    });

    it('throws RESPONSE_NOT_ACCEPTED when expected accepted but status differs', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
          expectedStatus: 'accepted',
        }),
      ).rejects.toThrow(RESPONSE_NOT_ACCEPTED);
    });

    it('throws RESPONSE_NOT_OK for other status mismatches', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
          expectedStatus: 'created',
        }),
      ).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('validates numeric expectedStatus', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({}),
      });

      await servicePostRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        body: {},
        expectedStatus: 204,
      });
    });

    it('returns raw Response when returnResponse is true', async () => {
      mockCsrfResponse({});
      const raw = {
        ok: true,
        status: 200,
        json: async () => ({}),
      };
      mockFetch.mockResolvedValueOnce(raw);

      const res = await servicePostRequest<Response>({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        body: {},
        returnResponse: true,
      });

      expect(res).toBe(raw);
    });

    it('merges additionalHeaders on POST', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await servicePostRequest({
        serviceUrl: baseUrl,
        endpoint: '/x',
        userSessionId: sessionId,
        body: {},
        additionalHeaders: { 'X-Extra': 'y' },
      });

      expect(mockFetch.mock.calls[1][1].headers).toMatchObject({
        'X-Extra': 'y',
      });
    });

    it('logs CSRF fetch failure from getCsrfTokenForService', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        headers: headersWithSetCookie(null),
      });

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
        }),
      ).rejects.toThrow();

      expect(console.error).toHaveBeenCalled();
    });

    it('throws when Set-Cookie header is missing on CSRF response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: headersWithSetCookie(null),
      });

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
        }),
      ).rejects.toThrow('Set-Cookie header not found');
    });

    it('throws when CSRF token is missing in Set-Cookie', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: headersWithSetCookie('OTHER=1; Path=/'),
      });

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
        }),
      ).rejects.toThrow('CSRF token not found in Set-Cookie header');
    });

    it('rethrows when CSRF GET fetch rejects', async () => {
      const err = new Error('csrf net');
      mockFetch.mockRejectedValueOnce(err);

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
        }),
      ).rejects.toThrow('csrf net');

      expect(String((console.error as jest.Mock).mock.calls[0][1])).toContain(
        'csrf net',
      );
    });

    it('logs and rethrows when POST fetch fails after CSRF', async () => {
      mockCsrfResponse({});
      const err = new Error('post failed');
      mockFetch.mockRejectedValueOnce(err);

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
        }),
      ).rejects.toThrow('post failed');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, err);
    });

    it('logs and rethrows ISS abandonment via outer catch', async () => {
      delete process.env.MHPD_ISS;

      await expect(
        servicePostRequest({
          serviceUrl: baseUrl,
          endpoint: '/x',
          userSessionId: sessionId,
          body: {},
        }),
      ).rejects.toThrow(REQUEST_ABANDONED);

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.any(Error),
      );
    });
  });

  describe('serviceDeleteRequest', () => {
    it('returns when DELETE succeeds (2xx)', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

      await expect(
        serviceDeleteRequest({
          serviceUrl: baseUrl,
          endpoint: '/data',
          userSessionId: sessionId,
        }),
      ).resolves.toBeUndefined();
    });

    it('returns when DELETE is 404', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

      await expect(
        serviceDeleteRequest({
          serviceUrl: baseUrl,
          endpoint: '/data',
          userSessionId: sessionId,
        }),
      ).resolves.toBeUndefined();
    });

    it('warns and continues for other 4xx responses', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });

      await serviceDeleteRequest({
        serviceUrl: baseUrl,
        endpoint: '/data',
        userSessionId: sessionId,
      });

      expect(console.warn).toHaveBeenCalledWith(
        'DELETE request returned 403, continuing operation',
      );
    });

    it('throws on 5xx with status on error and logs', async () => {
      mockCsrfResponse({});
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 });

      await expect(
        serviceDeleteRequest({
          serviceUrl: baseUrl,
          endpoint: '/data',
          userSessionId: sessionId,
        }),
      ).rejects.toMatchObject({
        message: `503: ${RESPONSE_NOT_OK}`,
        status: 503,
      });

      expect(console.error).toHaveBeenCalledWith(
        REQUEST_FAILED,
        expect.objectContaining({ status: 503 }),
      );
    });

    it('propagates CSRF errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('csrf'));

      await expect(
        serviceDeleteRequest({
          serviceUrl: baseUrl,
          endpoint: '/data',
          userSessionId: sessionId,
        }),
      ).rejects.toThrow('csrf');
    });

    it('logs and rethrows when DELETE fetch rejects', async () => {
      mockCsrfResponse({});
      const err = new Error('delete net');
      mockFetch.mockRejectedValueOnce(err);

      await expect(
        serviceDeleteRequest({
          serviceUrl: baseUrl,
          endpoint: '/data',
          userSessionId: sessionId,
        }),
      ).rejects.toThrow('delete net');

      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, err);
    });
  });
});
