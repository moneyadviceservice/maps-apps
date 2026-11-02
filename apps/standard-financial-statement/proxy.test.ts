/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import { proxy } from './proxy';

describe('SFS proxy', () => {
  describe('SFS V3 Route Access', () => {
    const originalEnv = process.env.SFS_V3_ENABLED;

    afterEach(() => {
      process.env.SFS_V3_ENABLED = originalEnv;
    });

    it.each([['false'], [false], [null], [undefined], ['abc123']])(
      'redirects to homepage when SFS_V3_ENABLED is %s',
      (input) => {
        // @ts-expect-error test should check values disallowed by the type definition
        process.env.SFS_V3_ENABLED = input;

        const req = new NextRequest('http://localhost:3000/en/v3');
        const res = proxy(req);

        expect(res?.status).toBe(307); // or 302 depending on NextResponse.redirect
        expect(res?.headers.get('location')).toBe('http://localhost:3000/');
      },
    );

    it('allows request through when SFS_V3_ENABLED is true', () => {
      process.env.SFS_V3_ENABLED = 'true';

      const req = new NextRequest('http://localhost:3000/en/v3');
      const res = proxy(req);

      expect(res?.status).toBe(200);
      expect(res?.headers.get('location')).toBeNull();
    });
  });
});
