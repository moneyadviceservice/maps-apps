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
    '/en/dashboard-privacy-notice',
    '/cy/dashboard-privacy-notice',
    '/en/taking-part/sign-up-update',
    '/cy/taking-part/sign-up-update',
    '/api/activate',
    '/.netlify/functions/form-handler',
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

  it.each(['/en', '/page.html'])(
    'redirects %s without a beaconId when secure beta is enabled',
    async (pathname) => {
      process.env.MHPD_SECURE_BETA_ENABLED = 'true';

      const response = await proxy(requestFor(pathname));

      expect(response.headers.get('location')).toBe(
        'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-dashboard/research-panel',
      );
    },
  );

  it.each(['/en/taking-part/sign-up-update', '/cy/taking-part/sign-up-update'])(
    'redirects to landing page with a beaconId when user accesses taking-part route',
    async (pathname) => {
      process.env.MHPD_SECURE_BETA_ENABLED = 'true';

      const request = requestFor(pathname);
      Object.defineProperty(request, 'cookies', {
        value: {
          has: () => true,
        },
      });

      const response = await proxy(request);

      expect(response.headers.get('location')).toBe(
        `http://localhost${pathname.split('/taking-part')[0]}`,
      );
    },
  );
});
