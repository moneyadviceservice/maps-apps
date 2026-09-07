import type { NextApiRequest, NextApiResponse } from 'next';

import type { AuthenticatedAccountTradingRequest } from './resolveAccountTradingNameRequest';
import {
  ensurePostMethodAndAccountSession,
  loadPrincipalFirmForTradingMutation,
  respondTradingNameMutationSuccess,
  tradingDocOwnedByMain,
} from './resolveAccountTradingNameRequest';

import type { IronSessionObject } from 'types/iron-session';
import type { TradingTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

const mockedResolveAccountMainFirm = jest.fn();
jest.mock('lib/account/resolveAccountMainFirm', () => ({
  resolveAccountMainFirm: (...args: unknown[]) =>
    mockedResolveAccountMainFirm(...args),
}));

function sessionReq(session: Partial<IronSessionObject>): MockReq {
  return {
    method: 'POST',
    session,
    headers: {},
    body: {},
  } as MockReq;
}

type MockReq = NextApiRequest & { session: IronSessionObject };

function mockRes(): NextApiResponse {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  return res as unknown as NextApiResponse;
}

describe('resolveAccountTradingNameRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensurePostMethodAndAccountSession', () => {
    it('redirects HTML clients to account when method is not POST', () => {
      const req = {
        ...sessionReq({
          isAccountAuthenticated: true,
          accountEmail: 'a@b.com',
        }),
        method: 'GET',
      } as MockReq;
      const res = mockRes();

      expect(ensurePostMethodAndAccountSession(req, res)).toBe(false);
      expect(res.redirect).toHaveBeenCalledWith(303, '/account');
    });

    it('redirects to login when session is not authenticated', () => {
      const req = sessionReq({});
      const res = mockRes();

      expect(ensurePostMethodAndAccountSession(req, res)).toBe(false);
      expect(res.redirect).toHaveBeenCalledWith(303, '/account/login');
    });

    it('returns true when POST with authenticated account email', () => {
      const req = sessionReq({
        isAccountAuthenticated: true,
        accountEmail: 'a@b.com',
      });
      const res = mockRes();

      expect(ensurePostMethodAndAccountSession(req, res)).toBe(true);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('loadPrincipalFirmForTradingMutation', () => {
    it('responds with 404 when firm id is missing', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { fca_number: 1 },
      });
      const req = sessionReq({
        isAccountAuthenticated: true,
        accountEmail: 'a@b.com',
      }) as AuthenticatedAccountTradingRequest;
      const res = mockRes();

      await expect(
        loadPrincipalFirmForTradingMutation(req, res, {
          requireMainFrnAsNumber: false,
        }),
      ).resolves.toBeUndefined();

      expect(res.redirect).toHaveBeenCalledWith(303, '/account');
    });

    it('responds with 404 when main FRN must be a number but is not', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'f1', fca_number: 'oops' as unknown as number },
      });
      const req = sessionReq({
        isAccountAuthenticated: true,
        accountEmail: 'a@b.com',
      }) as AuthenticatedAccountTradingRequest;
      const res = mockRes();

      await expect(
        loadPrincipalFirmForTradingMutation(req, res, {
          requireMainFrnAsNumber: true,
        }),
      ).resolves.toBeUndefined();

      expect(res.redirect).toHaveBeenCalledWith(303, '/account');
    });

    it('returns firm context when valid', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'f1', fca_number: 99 },
      });
      const req = sessionReq({
        isAccountAuthenticated: true,
        accountEmail: 'a@b.com',
      }) as AuthenticatedAccountTradingRequest;
      const res = mockRes();

      await expect(
        loadPrincipalFirmForTradingMutation(req, res, {
          requireMainFrnAsNumber: true,
        }),
      ).resolves.toEqual({
        firm: { id: 'f1', fca_number: 99 },
        firmId: 'f1',
        mainFrn: 99,
      });
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('tradingDocOwnedByMain', () => {
    const ctx = {
      firm: { id: 'main-1', fca_number: 123 } as never,
      firmId: 'main-1',
      mainFrn: 123,
    };

    it('returns true when main_firm_id matches', () => {
      const trading = {
        main_firm_id: 'main-1',
        fca_number: 123,
      } as TradingTravelInsuranceFirmDocument;

      expect(tradingDocOwnedByMain(trading, ctx)).toBe(true);
    });

    it('returns true for legacy trading row with matching FRN only', () => {
      const trading = {
        fca_number: 123,
      } as TradingTravelInsuranceFirmDocument;

      expect(tradingDocOwnedByMain(trading, ctx)).toBe(true);
    });

    it('returns false when main_firm_id points at another main', () => {
      const trading = {
        main_firm_id: 'other-main',
        fca_number: 123,
      } as TradingTravelInsuranceFirmDocument;

      expect(tradingDocOwnedByMain(trading, ctx)).toBe(false);
    });
  });

  describe('respondTradingNameMutationSuccess', () => {
    it('returns JSON when Accept/content-type requests JSON', () => {
      const req = {
        headers: { 'content-type': 'application/json' },
      } as NextApiRequest;
      const res = mockRes();

      respondTradingNameMutationSuccess(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ok: true });
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('redirects to Referer when it is an account page', () => {
      const req = {
        headers: { referer: 'https://example.com/account' },
      } as NextApiRequest;
      const res = mockRes();

      respondTradingNameMutationSuccess(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        302,
        'https://example.com/account',
      );
    });

    it('redirects to /account when Referer is not an account page', () => {
      const req = {
        headers: { referer: 'https://example.com/from-here' },
      } as NextApiRequest;
      const res = mockRes();

      respondTradingNameMutationSuccess(req, res);

      expect(res.redirect).toHaveBeenCalledWith(302, '/account');
    });

    it('redirects to /account when Referer is absent', () => {
      const req = { headers: {} } as NextApiRequest;
      const res = mockRes();

      respondTradingNameMutationSuccess(req, res);

      expect(res.redirect).toHaveBeenCalledWith(302, '/account');
    });
  });
});
