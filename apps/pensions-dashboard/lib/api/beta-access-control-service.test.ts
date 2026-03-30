import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';
import { VerifyCodeResponseCode } from '../types';
import {
  BETA_ACCESS_SEND_CODE_RATE_LIMITED,
  sendCode,
  validateBetaAccessToken,
  verifyCode,
} from './beta-access-control-service';

describe('beta-access-control-service', () => {
  const SERVICE_BASE = 'http://beta-access.test';
  const originalEnv = process.env;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
    mockFetch = global.fetch as jest.Mock;
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    process.env = { ...originalEnv, MHPD_BETA_ACCESS_SERVICE: SERVICE_BASE };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  const okJson = (body: unknown) => ({
    ok: true,
    json: jest.fn().mockResolvedValue(body),
  });

  const expectGet = (url: string, headers?: Record<string, string>) => {
    expect(mockFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'GET',
        signal: expect.any(AbortSignal),
        ...(headers ? { headers } : {}),
      }),
    );
  };

  describe('sendCode', () => {
    it.each([
      [
        'plain linkId',
        'test-link-123',
        `${SERVICE_BASE}/send-code?linkId=test-link-123`,
      ],
      [
        'encoded linkId',
        'link with spaces',
        `${SERVICE_BASE}/send-code?linkId=link%20with%20spaces`,
      ],
    ])('GET send-code (%s)', async (_label, linkId, expectedUrl) => {
      mockFetch.mockResolvedValue({ ok: true });
      await sendCode(linkId);
      expectGet(expectedUrl);
    });

    it.each([
      {
        status: 500,
        statusText: '',
        match: /Network response was not ok \(HTTP 500\)$/,
      },
      {
        status: 502,
        statusText: 'Bad Gateway',
        match: /Network response was not ok \(HTTP 502 Bad Gateway\)/,
      },
    ])(
      'throws when HTTP not ok (%#)',
      async ({ status, statusText, match }) => {
        mockFetch.mockResolvedValue({ ok: false, status, statusText });
        await expect(sendCode('id')).rejects.toThrow(match);
      },
    );

    it('throws when rate limited (429)', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 429 });
      await expect(sendCode('id')).rejects.toThrow(
        BETA_ACCESS_SEND_CODE_RATE_LIMITED,
      );
    });

    it('throws when service URL missing', async () => {
      delete process.env.MHPD_BETA_ACCESS_SERVICE;
      await expect(sendCode('id')).rejects.toThrow(
        'MHPD_BETA_ACCESS_SERVICE is not configured',
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('throws when linkId missing', async () => {
      await expect(sendCode('')).rejects.toThrow('Missing linkId');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('logs and rethrows on fetch failure', async () => {
      const err = new Error('network down');
      mockFetch.mockRejectedValue(err);
      await expect(sendCode('id')).rejects.toThrow('network down');
      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, err);
    });
  });

  describe('verifyCode', () => {
    it.each([
      [
        'test-link-123',
        '123456',
        `${SERVICE_BASE}/verify-code?linkId=test-link-123&code=123456`,
        { responseCode: VerifyCodeResponseCode.SUCCESS, token: 't' },
        { token: 't' },
      ],
      [
        'link with spaces',
        'code with spaces',
        `${SERVICE_BASE}/verify-code?linkId=link+with+spaces&code=code+with+spaces`,
        { responseCode: VerifyCodeResponseCode.SUCCESS, token: 'x' },
        { token: 'x' },
      ],
    ])(
      'GET verify-code with code (%#)',
      async (linkId, code, url, body, out) => {
        mockFetch.mockResolvedValue(okJson(body));
        await expect(verifyCode(linkId, code)).resolves.toEqual(out);
        expectGet(url);
      },
    );

    it.each([
      [
        VerifyCodeResponseCode.INVALID_CODE,
        { responseCode: VerifyCodeResponseCode.INVALID_CODE },
      ],
      [
        VerifyCodeResponseCode.CODE_VALIDATION_BACK_OFF,
        { responseCode: VerifyCodeResponseCode.CODE_VALIDATION_BACK_OFF },
      ],
    ])(
      'returns responseCode when code rejected (rc=%s)',
      async (rc, expected) => {
        mockFetch.mockResolvedValue(okJson({ responseCode: rc, token: null }));
        await expect(verifyCode('lid', '123456')).resolves.toEqual(expected);
      },
    );

    it('throws when HTTP not ok', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      await expect(verifyCode('a', '1')).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('throws when success but token missing', async () => {
      mockFetch.mockResolvedValue(
        okJson({
          responseCode: VerifyCodeResponseCode.SUCCESS,
          token: null,
        }),
      );
      await expect(verifyCode('a', '1')).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it('rejects with SyntaxError when response.json fails (no extra logging)', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockRejectedValue(new SyntaxError('bad json')),
      });
      await expect(verifyCode('a', '1')).rejects.toThrow(SyntaxError);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('throws when responseCode out of enum range', async () => {
      mockFetch.mockResolvedValue(okJson({ responseCode: 99, token: null }));
      await expect(verifyCode('a', '1')).rejects.toThrow(RESPONSE_NOT_OK);
    });

    it.each([
      {
        code: undefined as string | undefined,
        body: {
          responseCode: VerifyCodeResponseCode.SUCCESS,
          token: null,
        },
        expected: { responseCode: VerifyCodeResponseCode.SUCCESS },
        url: `${SERVICE_BASE}/verify-code?linkId=lid`,
      },
      {
        code: undefined,
        body: {
          responseCode: VerifyCodeResponseCode.SUCCESS,
          token: 'ignored',
        },
        expected: { responseCode: VerifyCodeResponseCode.SUCCESS },
        url: `${SERVICE_BASE}/verify-code?linkId=lid`,
      },
    ])(
      'GET verify-code link-only (%#)',
      async ({ code, body, expected, url }) => {
        mockFetch.mockResolvedValue(okJson(body));
        await expect(verifyCode('lid', code)).resolves.toEqual(expected);
        expectGet(url);
      },
    );

    it('throws when linkId missing', async () => {
      await expect(verifyCode('', '1')).rejects.toThrow('Missing linkId');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('throws when service URL missing', async () => {
      delete process.env.MHPD_BETA_ACCESS_SERVICE;
      await expect(verifyCode('a', '1')).rejects.toThrow(
        'MHPD_BETA_ACCESS_SERVICE is not configured',
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('throws RESPONSE_NOT_OK when fetch fails (logged in fetch layer)', async () => {
      const err = new Error('econnreset');
      mockFetch.mockRejectedValue(err);
      await expect(verifyCode('a', '1')).rejects.toThrow(RESPONSE_NOT_OK);
      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, err);
    });

    it.each([
      { body: null },
      { body: {} },
      { body: { responseCode: '0', token: 't' } },
      { body: { responseCode: 0.5, token: 't' } },
      { body: { responseCode: -1, token: null } },
    ])(
      'throws RESPONSE_NOT_OK when parsed body shape is invalid (%#)',
      async ({ body }) => {
        mockFetch.mockResolvedValue(okJson(body));
        await expect(verifyCode('a', '1')).rejects.toThrow(RESPONSE_NOT_OK);
        expect(console.error).not.toHaveBeenCalled();
      },
    );
  });

  describe('validateBetaAccessToken', () => {
    it('GET /validate with token header returns valid', async () => {
      mockFetch.mockResolvedValue({ ok: true });
      await expect(validateBetaAccessToken('tok')).resolves.toBe('valid');
      expectGet(`${SERVICE_BASE}/validate`, { token: 'tok' });
    });

    it.each([400, 401, 403, 404])('invalid for HTTP %s', async (status) => {
      mockFetch.mockResolvedValue({ ok: false, status });
      await expect(validateBetaAccessToken('tok')).resolves.toBe('invalid');
    });

    it('unavailable for 5xx', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 502 });
      await expect(validateBetaAccessToken('tok')).resolves.toBe('unavailable');
    });

    it('unavailable when service URL missing', async () => {
      delete process.env.MHPD_BETA_ACCESS_SERVICE;
      await expect(validateBetaAccessToken('tok')).resolves.toBe('unavailable');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('invalid when token empty', async () => {
      await expect(validateBetaAccessToken('')).resolves.toBe('invalid');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('unavailable when fetch fails', async () => {
      const err = new Error('offline');
      mockFetch.mockRejectedValue(err);
      await expect(validateBetaAccessToken('tok')).resolves.toBe('unavailable');
      expect(console.error).toHaveBeenCalledWith(REQUEST_FAILED, err);
    });
  });
});
