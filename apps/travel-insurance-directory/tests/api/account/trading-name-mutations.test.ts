import type { NextApiHandler, NextApiRequest } from 'next';

import clearHandler from 'pages/api/account/clear-trading-name';
import setHandler from 'pages/api/account/set-trading-name';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';

import {
  createMockRes,
  defaultJsonHeader,
} from 'tests/api/account-auth/testUtils';

jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: (fn: NextApiHandler) => fn,
}));

const mockedResolveAccountMainFirm = jest.fn();
jest.mock('lib/account/resolveAccountMainFirm', () => ({
  resolveAccountMainFirm: (...args: unknown[]) =>
    mockedResolveAccountMainFirm(...args),
}));

const mockedUpsertTradingFirm = jest.fn();
const mockedFetchTradingDocForMainById = jest.fn();
const mockedDeleteTradingFirmDocument = jest.fn();
jest.mock('lib/account/tradingFirm', () => ({
  upsertTradingFirm: (...args: unknown[]) => mockedUpsertTradingFirm(...args),
  fetchTradingDocForMainById: (...args: unknown[]) =>
    mockedFetchTradingDocForMainById(...args),
  deleteTradingFirmDocument: (...args: unknown[]) =>
    mockedDeleteTradingFirmDocument(...args),
}));

type MockReq = NextApiRequest & {
  session: { [key: string]: unknown };
};

function createReq(
  method: string,
  session: Record<string, unknown>,
  body: Record<string, unknown> = {},
  headers: Record<string, string | string[] | undefined> = defaultJsonHeader,
): MockReq {
  return {
    method,
    headers,
    session,
    body,
  } as unknown as MockReq;
}

const authenticatedSession = {
  isAccountAuthenticated: true,
  accountEmail: 'test@example.com',
};

describe('account trading name API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each([
    {
      label: 'clear-trading-name',
      handler: clearHandler,
      extraBody: { tradingFirmId: 'trading1' },
      mockFailure: () => {
        mockedFetchTradingDocForMainById.mockResolvedValueOnce({
          success: true,
          response: { id: 'trading1', main_firm_id: 'firm1', fca_number: 123 },
        });
        mockedDeleteTradingFirmDocument.mockResolvedValueOnce({
          success: false,
        });
      },
    },
    {
      label: 'set-trading-name',
      handler: setHandler,
      extraBody: { name: 'Any Trading Name' },
      mockFailure: () => {
        mockedUpsertTradingFirm.mockResolvedValueOnce({ success: false });
      },
    },
  ])('$label shared behaviour', ({ handler, extraBody, mockFailure }) => {
    it('returns 405 JSON for non-POST when client expects JSON', async () => {
      const req = createReq('GET', authenticatedSession);
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
    });

    it('redirects HTML clients to account on non-POST', async () => {
      const req = createReq('GET', authenticatedSession, {}, {});
      const res = createMockRes();

      await handler(req, res);

      expect(res.redirect).toHaveBeenCalledWith(303, '/account');
    });

    it('returns 401 when not account-authenticated', async () => {
      const req = createReq('POST', {});
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns 404 when principal firm cannot be resolved', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: null,
      });
      const req = createReq('POST', authenticatedSession, extraBody);
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 500 when trading mutation fails', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: 123, type: 'main' },
      });
      mockFailure();

      const req = createReq('POST', authenticatedSession, extraBody);
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('clear-trading-name', () => {
    it('returns 400 when tradingFirmId is missing', async () => {
      const req = createReq('POST', authenticatedSession, {});
      const res = createMockRes();

      await clearHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockedResolveAccountMainFirm).not.toHaveBeenCalled();
    });

    it('deletes trading doc when owned by main firm and returns JSON ok', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: 123, type: 'main' },
      });
      mockedFetchTradingDocForMainById.mockResolvedValueOnce({
        success: true,
        response: { id: 'trading1', main_firm_id: 'firm1', fca_number: 123 },
      });
      mockedDeleteTradingFirmDocument.mockResolvedValueOnce({ success: true });

      const req = createReq(
        'POST',
        authenticatedSession,
        { tradingFirmId: 'trading1' },
        defaultJsonHeader,
      );
      const res = createMockRes();

      await clearHandler(req, res);

      expect(mockedFetchTradingDocForMainById).toHaveBeenCalledWith(
        'trading1',
        123,
      );
      expect(mockedDeleteTradingFirmDocument).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'trading1' }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ok: true });
    });

    it('returns 404 when trading doc is not on the principal main FRN', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: 123, type: 'main' },
      });
      mockedFetchTradingDocForMainById.mockResolvedValueOnce({
        success: false,
        error: 'Trading firm not found',
      });

      const req = createReq(
        'POST',
        authenticatedSession,
        { tradingFirmId: 'trading1' },
        defaultJsonHeader,
      );
      const res = createMockRes();

      await clearHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(mockedDeleteTradingFirmDocument).not.toHaveBeenCalled();
    });

    it('returns 403 when trading firm has an FCA visibility block', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: 123, type: 'main' },
      });
      mockedFetchTradingDocForMainById.mockResolvedValueOnce({
        success: true,
        response: {
          id: 'trading1',
          main_firm_id: 'firm1',
          fca_number: 123,
          hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
        },
      });

      const req = createReq(
        'POST',
        authenticatedSession,
        { tradingFirmId: 'trading1' },
        defaultJsonHeader,
      );
      const res = createMockRes();

      await clearHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(mockedDeleteTradingFirmDocument).not.toHaveBeenCalled();
    });

    it('returns 403 when main firm has an FCA visibility block', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: {
          id: 'firm1',
          fca_number: 123,
          type: 'main',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        },
      });
      mockedFetchTradingDocForMainById.mockResolvedValueOnce({
        success: true,
        response: {
          id: 'trading1',
          main_firm_id: 'firm1',
          fca_number: 123,
        },
      });

      const req = createReq(
        'POST',
        authenticatedSession,
        { tradingFirmId: 'trading1' },
        defaultJsonHeader,
      );
      const res = createMockRes();

      await clearHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(mockedDeleteTradingFirmDocument).not.toHaveBeenCalled();
    });

    it('allows delete for legacy trading doc without main_firm_id when FRN matches', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: 123, type: 'main' },
      });
      mockedFetchTradingDocForMainById.mockResolvedValueOnce({
        success: true,
        response: { id: 'trading1', fca_number: 123 },
      });
      mockedDeleteTradingFirmDocument.mockResolvedValueOnce({ success: true });

      const req = createReq(
        'POST',
        authenticatedSession,
        { tradingFirmId: 'trading1' },
        defaultJsonHeader,
      );
      const res = createMockRes();

      await clearHandler(req, res);

      expect(mockedFetchTradingDocForMainById).toHaveBeenCalledWith(
        'trading1',
        123,
      );
      expect(mockedDeleteTradingFirmDocument).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'trading1' }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('redirects to Referer on HTML-style success', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: 123, type: 'main' },
      });
      mockedFetchTradingDocForMainById.mockResolvedValueOnce({
        success: true,
        response: { id: 'trading1', main_firm_id: 'firm1', fca_number: 123 },
      });
      mockedDeleteTradingFirmDocument.mockResolvedValueOnce({ success: true });

      const req = createReq(
        'POST',
        authenticatedSession,
        { tradingFirmId: 'trading1' },
        {
          referer: 'https://example.com/from-here',
        },
      );
      const res = createMockRes();

      await clearHandler(req, res);

      expect(res.redirect).toHaveBeenCalledWith(302, '/account');
    });
  });

  describe('set-trading-name', () => {
    it('returns 400 when name is missing after auth', async () => {
      const req = createReq('POST', authenticatedSession, { name: '' });
      const res = createMockRes();

      await setHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockedResolveAccountMainFirm).not.toHaveBeenCalled();
    });

    it('returns 404 when main FRN is not a number', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: undefined, type: 'main' },
      });
      const req = createReq('POST', authenticatedSession, {
        name: 'Valid Name',
      });
      const res = createMockRes();

      await setHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('upserts trading document and returns JSON ok', async () => {
      mockedResolveAccountMainFirm.mockResolvedValueOnce({
        firm: { id: 'firm1', fca_number: 123, type: 'main' },
      });
      mockedUpsertTradingFirm.mockResolvedValueOnce({
        success: true,
        response: { id: 'trading1', registered_name: 'Just Travel Cover' },
      });

      const req = createReq(
        'POST',
        authenticatedSession,
        { name: 'Just Travel Cover' },
        defaultJsonHeader,
      );
      const res = createMockRes();

      await setHandler(req, res);

      expect(mockedUpsertTradingFirm).toHaveBeenCalledWith({
        name: 'Just Travel Cover',
        mainFrn: 123,
        mainFirmId: 'firm1',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ok: true });
    });
  });
});
