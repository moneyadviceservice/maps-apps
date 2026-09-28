import type { NextApiRequest, NextApiResponse } from 'next';

import type { IronSessionObject } from 'types/iron-session';

import type { NextApiRequestWithSession } from '@maps-react/entra-id/auth-msal';

import {
  ensurePostMethodAndAdminSession,
  getFirmIdFromAdminRequest,
  redirectToAdminFirmDetail,
  withAdminFirmApiSession,
} from './adminFirmRequest';

jest.mock('lib/auth/sessionManagement', () => ({
  withSession: (fn: (req: unknown, res: unknown) => unknown) => fn,
}));

describe('adminFirmRequest', () => {
  const originalCi = process.env.CI;

  afterAll(() => {
    process.env.CI = originalCi;
  });

  describe('ensurePostMethodAndAdminSession', () => {
    function createRes() {
      return {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
        json: jest.fn(),
      };
    }

    it('rejects non-POST methods', () => {
      delete process.env.CI;
      const res = createRes();
      const req = {
        method: 'GET',
        session: { isAdmin: true },
      } as NextApiRequest & { session: IronSessionObject };

      const ok = ensurePostMethodAndAdminSession(
        req,
        res as unknown as NextApiResponse,
      );

      expect(ok).toBe(false);
      expect(res.status).toHaveBeenCalledWith(405);
    });

    it('rejects missing admin session when not CI', () => {
      delete process.env.CI;
      const res = createRes();
      const req = {
        method: 'POST',
        session: {},
      } as NextApiRequest & { session: IronSessionObject };

      const ok = ensurePostMethodAndAdminSession(
        req,
        res as unknown as NextApiResponse,
      );

      expect(ok).toBe(false);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('allows POST without admin session when CI is true', () => {
      process.env.CI = 'true';
      const res = createRes();
      const req = {
        method: 'POST',
        session: {},
      } as NextApiRequest & { session: IronSessionObject };

      const ok = ensurePostMethodAndAdminSession(
        req,
        res as unknown as NextApiResponse,
      );

      expect(ok).toBe(true);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('allows POST with admin session when not CI', () => {
      delete process.env.CI;
      const res = createRes();
      const req = {
        method: 'POST',
        session: { isAdmin: true },
      } as NextApiRequest & { session: IronSessionObject };

      const ok = ensurePostMethodAndAdminSession(
        req,
        res as unknown as NextApiResponse,
      );

      expect(ok).toBe(true);
    });
  });

  it('getFirmIdFromAdminRequest reads string and array query ids', () => {
    expect(
      getFirmIdFromAdminRequest({
        query: { id: ' firm-1 ' },
      } as unknown as NextApiRequest),
    ).toBe('firm-1');
    expect(
      getFirmIdFromAdminRequest({
        query: { id: ['firm-2'] },
      } as unknown as NextApiRequest),
    ).toBe('firm-2');
    expect(
      getFirmIdFromAdminRequest({ query: {} } as unknown as NextApiRequest),
    ).toBe('');
  });

  it('redirectToAdminFirmDetail sends 302 to firm detail', () => {
    const redirect = jest.fn();
    redirectToAdminFirmDetail(
      { redirect } as unknown as NextApiResponse,
      'firm-9',
    );
    expect(redirect).toHaveBeenCalledWith(302, '/admin/firms/firm-9');
  });

  describe('withAdminFirmApiSession', () => {
    it('attaches an empty session under CI without requiring SESSION_SECRET', async () => {
      process.env.CI = 'true';
      const handler = jest.fn(async () => undefined);
      const wrapped = withAdminFirmApiSession(handler);
      const req = {} as NextApiRequest;
      const res = {} as NextApiResponse;

      await wrapped(req, res);

      expect((req as NextApiRequestWithSession).session).toEqual({});
      expect(handler).toHaveBeenCalledWith(req, res);
    });

    it('delegates to withSession when not CI', async () => {
      delete process.env.CI;
      const handler = jest.fn(async () => undefined);
      const wrapped = withAdminFirmApiSession(handler);
      const req = { session: { isAdmin: true } } as NextApiRequestWithSession;
      const res = {} as NextApiResponse;

      await wrapped(req, res);

      expect(handler).toHaveBeenCalledWith(req, res);
    });
  });
});
