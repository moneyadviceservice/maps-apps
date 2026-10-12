/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import { proxy } from './proxy';

const originalSecureBeta = process.env.MHPD_SECURE_BETA_ENABLED;

const requestFor = (pathname: string) =>
  new NextRequest(new URL(pathname, 'http://localhost'));

describe('proxy secure beta access', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env.MHPD_SECURE_BETA_ENABLED = originalSecureBeta;
    jest.restoreAllMocks();
  });

  it.each([
    '/en/link-access-error',
    '/cy/link-access-error',
    '/en/verify-code',
    '/en/dashboard-privacy-notice',
    '/cy/dashboard-privacy-notice',
    '/api/activate',
    '/.netlify/functions/validate-token',
    '/images/logo.png',
  ])(
    'allows %s without a beaconId when secure beta is enabled',
    async (pathname) => {
      process.env.MHPD_SECURE_BETA_ENABLED = 'true';

      const response = await proxy(requestFor(pathname));

      expect(response.headers.get('x-middleware-next')).toBe('1');
      expect(response.headers.get('location')).toBeNull();
    },
  );

  it.each(['/verify-code', '/cy/verify-code'])(
    'sends %s to the English verify-code page without a beaconId',
    async (pathname) => {
      process.env.MHPD_SECURE_BETA_ENABLED = 'true';

      const response = await proxy(requestFor(pathname));

      expect(response.headers.get('location')).toBe(
        'http://localhost/en/verify-code',
      );
    },
  );

  it.each(['/en', '/page.html'])(
    'redirects %s without a beaconId when secure beta is enabled',
    async (pathname) => {
      process.env.MHPD_SECURE_BETA_ENABLED = 'true';

      const response = await proxy(requestFor(pathname));

      expect(response.headers.get('location')).toBe(
        'http://localhost/en/link-access-error',
      );
    },
  );
});
