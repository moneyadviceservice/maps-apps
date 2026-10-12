import { NextApiRequest, NextApiResponse } from 'next';

import * as wantsJsonModule from 'utils/api/wantsJson';

import { returnError } from './returnError';

jest.mock('utils/api/wantsJson');

describe('returnError', () => {
  let mockRes: Partial<NextApiResponse>;
  let mockReq: Partial<NextApiRequest>;
  const pageUrl = '/registration';

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('when client wants JSON', () => {
    beforeEach(() => {
      (wantsJsonModule.wantsJson as jest.Mock).mockReturnValue(true);
    });

    it('should return a JSON response with default error mapping for status 400', () => {
      returnError(
        mockRes as NextApiResponse,
        mockReq as NextApiRequest,
        pageUrl,
        400,
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: 400,
        errorType: 'invalid',
        message: 'The request payload is invalid.',
      });
    });

    it('should allow overriding the error message and type', () => {
      returnError(
        mockRes as NextApiResponse,
        mockReq as NextApiRequest,
        pageUrl,
        500,
        'Custom Message',
        'customType',
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: 500,
        errorType: 'customType',
        message: 'Custom Message',
      });
    });

    it('should return "unknown" and "Unexpected error" for unmapped status codes', () => {
      returnError(
        mockRes as NextApiResponse,
        mockReq as NextApiRequest,
        pageUrl,
        418,
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: 418,
        errorType: 'unknown',
        message: 'Unexpected error',
      });
    });
  });

  describe('when client does NOT want JSON (Redirect)', () => {
    beforeEach(() => {
      (wantsJsonModule.wantsJson as jest.Mock).mockReturnValue(false);
    });

    it('should redirect to the pageUrl with the errorType as a query param', () => {
      returnError(
        mockRes as NextApiResponse,
        mockReq as NextApiRequest,
        pageUrl,
        404,
      );

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/registration?error=notFound',
      );
    });

    it('should use custom errorType in the redirect query param if provided', () => {
      returnError(
        mockRes as NextApiResponse,
        mockReq as NextApiRequest,
        pageUrl,
        500,
        undefined,
        'maintenance',
      );

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/registration?error=maintenance',
      );
    });

    it('should URI encode the error type in the redirect URL', () => {
      returnError(
        mockRes as NextApiResponse,
        mockReq as NextApiRequest,
        pageUrl,
        500,
        undefined,
        'critical error',
      );

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        '/registration?error=critical%20error',
      );
    });
  });
});
