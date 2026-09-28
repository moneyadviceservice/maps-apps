import OriginalCookies from 'cookies';
import type { IncomingMessage, ServerResponse } from 'node:http';

import Cookies from './cookies';

jest.mock('cookies');

describe('Cookies (proxy-aware wrapper)', () => {
  let req: Partial<IncomingMessage> & { headers?: Record<string, string> };
  let res: Partial<ServerResponse>;

  const createMockCookiesInstance = () =>
    ({
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as InstanceType<typeof OriginalCookies>);

  beforeEach(() => {
    jest.clearAllMocks();
    req = { headers: {} };
    res = {};
    jest.mocked(OriginalCookies).mockImplementation(createMockCookiesInstance);
  });

  it('sets req.protocol to https when x-forwarded-proto is https', () => {
    req.headers = { 'x-forwarded-proto': 'https' };

    const cookies = new Cookies(req as IncomingMessage, res as ServerResponse);

    expect((req as { protocol?: string }).protocol).toBe('https');
    expect(OriginalCookies).toHaveBeenCalledWith(req, res);
    expect(cookies.get('sessionId')).toBeUndefined();
  });

  it.each([
    ['absent', {}],
    ['http', { 'x-forwarded-proto': 'http' }],
  ])('does not set req.protocol when x-forwarded-proto is %s', (_, headers) => {
    req.headers = headers;

    const cookies = new Cookies(req as IncomingMessage, res as ServerResponse);

    expect((req as { protocol?: string }).protocol).toBeUndefined();
    expect(OriginalCookies).toHaveBeenCalledWith(req, res);
    expect(cookies.get('sessionId')).toBeUndefined();
  });

  it('passes options through to the underlying cookies package', () => {
    const options = { keys: ['secret'] };

    const cookies = new Cookies(
      req as IncomingMessage,
      res as ServerResponse,
      options,
    );

    expect(OriginalCookies).toHaveBeenCalledWith(req, res, options);
    expect(cookies.get('sessionId')).toBeUndefined();
  });
});
