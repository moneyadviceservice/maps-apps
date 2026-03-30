import { createMocks } from 'node-mocks-http';

import embedHandler from './embed';

function callEmbedHandler(headers: Record<string, string | undefined> = {}) {
  const { req, res } = createMocks({
    method: 'GET',
    headers,
  });
  embedHandler(req as any, res as any);
  return res;
}

function expectIframeUrl(
  headers: Record<string, string | undefined>,
  expectedUrl: string,
) {
  const res = callEmbedHandler(headers);
  expect(res._getStatusCode()).toBe(200);
  expect(res.getHeader('Content-Type')).toBe('text/javascript');
  expect(res._getData()).toContain(expectedUrl);
}

describe('embedHandler', () => {
  it('returns javascript with default localhost origin', () => {
    expectIframeUrl({}, 'http://localhost:3000/iframeResizer.js');
  });

  it('uses host header when provided', () => {
    expectIframeUrl(
      { host: 'example.com' },
      'https://example.com/iframeResizer.js',
    );
  });

  it('uses x-forwarded-host header', () => {
    expectIframeUrl(
      { host: 'ignored.com', 'x-forwarded-host': 'forwarded.com' },
      'https://forwarded.com/iframeResizer.js',
    );
  });

  it('uses x-forwarded-proto header', () => {
    expectIframeUrl(
      { host: 'example.com', 'x-forwarded-proto': 'http' },
      'http://example.com/iframeResizer.js',
    );
  });

  it('falls back to https when protocol is invalid', () => {
    expectIframeUrl(
      { host: 'example.com', 'x-forwarded-proto': 'ftp' },
      'https://example.com/iframeResizer.js',
    );
  });
});
