import { NextApiRequest, NextApiResponse } from 'next';

import handler from './fca-lookup';

jest.mock('lib/sessions/withIronSession', () => ({
  withIronSession: (
    fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  ) => fn,
}));

jest.mock('lib/sessions/registerSessionOptions', () => ({
  registerSessionOptions: {},
}));

type MockResponse = {
  redirect: jest.Mock;
  status: jest.Mock;
  json: jest.Mock;
};

type MockRequest = {
  query: Partial<{ [key: string]: string | string[] }>;
  headers: Partial<{ [key: string]: string }>;
  session: {
    fcaData?: unknown;
    save: jest.Mock;
    destroy?: jest.Mock;
  };
};

describe('FCA Lookup Handler', () => {
  let req: NextApiRequest;
  let res: NextApiResponse;
  let mockRes: MockResponse;
  let mockReq: MockRequest;

  const mockFetch = jest.fn();
  globalThis.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.FCA_API_BASE_URL = 'https://api.fca.org.uk';
    process.env.FCA_API_KEY = 'test-key';
    process.env.FCA_API_EMAIL = 'test@test.com';

    mockReq = {
      query: {},
      headers: {},
      session: {
        save: jest.fn().mockResolvedValue(undefined),
      },
    };
    req = mockReq as unknown as NextApiRequest;

    mockRes = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    res = mockRes as unknown as NextApiResponse;
  });

  describe('Validation Logic', () => {
    it('redirects with error=required if fcaNumber is missing', async () => {
      await handler(req, res);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/register/step-1?error=required',
      );
    });

    it('redirects with error=invalid if fcaNumber contains non-digits', async () => {
      req.query = { fcaNumber: '123ABC' };

      await handler(req, res);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/register/step-1?error=invalid',
      );
    });
  });

  describe('External API Interaction', () => {
    it('handles 404 from FCA API correctly', async () => {
      req.query = { fcaNumber: '123456' };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await handler(req, res);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/register/step-1?error=notFound',
      );
    });

    it('handles API success and saves session', async () => {
      req.query = { fcaNumber: '123456' };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          Data: [
            {
              FRN: '123456',
              firmName: 'Test Firm Ltd',
            },
          ],
        }),
      } as Response);

      await handler(req, res);

      expect(req.session.fcaData).toEqual({
        firmName: 'Test Firm Ltd',
        frnNumber: '123456',
      });
      expect(mockReq.session.save).toHaveBeenCalled();

      expect(mockRes.redirect).toHaveBeenCalledWith(302, '/register/step-2');
    });

    it('handles API success but missing FRN in data payload (Treats as 404)', async () => {
      req.query = { fcaNumber: '123456' };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          Data: [], // Missing FRN
        }),
      } as Response);

      await handler(req, res);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/register/step-1?error=notFound',
      );
    });
  });

  describe('Content Negotiation (JSON vs HTML)', () => {
    it('returns JSON response when Content-Type is application/json', async () => {
      req.query = { fcaNumber: '123456' };
      req.headers['content-type'] = 'application/json';

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          Data: [{ FRN: '123456' }],
        }),
      } as Response);

      await handler(req, res);

      expect(mockRes.redirect).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });

    it('returns JSON error when Content-Type is application/json and API fails', async () => {
      req.query = { fcaNumber: '123456' };
      req.headers['content-type'] = 'application/json';

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await handler(req, res);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: 500,
        errorType: 'apiError',
        message: expect.stringContaining('An error occurred'),
      });
    });
  });

  describe('Exception Handling', () => {
    it('catches network errors and returns 500', async () => {
      req.query = { fcaNumber: '123456' };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        /* no-op */
      });

      mockFetch.mockRejectedValue(new Error('Network Error'));

      await handler(req, res);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/register/step-1?error=apiError', // 500 maps to apiError
      );

      consoleSpy.mockRestore();
    });
  });
});
