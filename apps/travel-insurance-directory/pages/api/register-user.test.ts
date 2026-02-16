import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import * as entraIdService from '@maps-react/entra-id/entraIdService';

import handler from './register-user';
jest.mock('@maps-react/entra-id/entraIdService');
jest.mock('cookies');

const mockedCookies = Cookies as jest.MockedClass<typeof Cookies>;
const mockedEntra = entraIdService as jest.Mocked<typeof entraIdService>;

function createMockRes(): NextApiResponse {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
}

type JsonObject = { [key: string]: unknown };

function createMockReq<TBody extends JsonObject>(
  body: TBody,
  method = 'POST',
): NextApiRequest {
  return {
    method,
    body,
  } as NextApiRequest;
}

function mockCookies(getValue?: string) {
  mockedCookies.mockImplementation(
    () =>
      ({
        get: jest.fn().mockReturnValue(getValue),
        set: jest.fn(),
      } as unknown as Cookies),
  );
}

describe('Sign-up API handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Method handling', () => {
    it('returns 405 for non-POST requests', async () => {
      const req = createMockReq({}, 'GET');
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
      expect(res.json).toHaveBeenCalledWith({
        error: 'Method Not Allowed',
      });
    });
  });

  describe('Initial sign-up flow', () => {
    it('successfully starts signup and sends OTP', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockResolvedValue({
        success: true,
        continuation_token: 'start-token',
      });

      mockedEntra.getChallenge.mockResolvedValue({
        success: true,
        continuation_token: 'challenge-token',
      });

      const req = createMockReq({
        emailAddress: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        jobTitle: 'Dev',
        mobilePhone: '123',
        individualReferenceNumber: 'IRN123',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.startSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'oob redirect',
        expect.objectContaining({
          displayName: 'Test User',
        }),
      );

      expect(mockedEntra.getChallenge).toHaveBeenCalledWith(
        'test@example.com',
        'start-token',
        'oob',
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ otpSent: true });
    });

    it('returns 400 if startSignUp fails', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockResolvedValue({
        success: false,
        error: 'email_exists',
      });

      const req = createMockReq({
        emailAddress: 'test@example.com',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        name: 'emailAddress',
        error: 'email_exists',
      });
    });

    it('returns 500 if getChallenge fails', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockResolvedValue({
        success: true,
        continuation_token: 'start-token',
      });

      mockedEntra.getChallenge.mockResolvedValue({
        success: false,
      });

      const req = createMockReq({
        emailAddress: 'test@example.com',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to get challenge',
      });
    });
  });

  describe('OTP verification flow', () => {
    it('successfully verifies OTP and returns id_token', async () => {
      mockCookies('continuation-token');

      mockedEntra.submitOtp.mockResolvedValue({
        success: true,
        continuation_token: 'otp-token',
      });

      mockedEntra.getToken.mockResolvedValue({
        id_token: 'final-id-token',
      });

      const req = createMockReq({
        emailAddress: 'test@example.com',
        otp: '123456',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.submitOtp).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'continuation-token',
      );

      expect(mockedEntra.getToken).toHaveBeenCalledWith(
        'test@example.com',
        'otp-token',
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        id_token: 'final-id-token',
      });
    });

    it('returns 400 if continuation token is missing', async () => {
      mockCookies();

      const req = createMockReq({
        emailAddress: 'test@example.com',
        otp: '123456',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Continuation token not found.',
      });
    });

    it('restarts signup if OTP token is expired', async () => {
      mockCookies('old-token');

      mockedEntra.submitOtp.mockResolvedValue({
        success: false,
        error: 'expired_token',
      });

      mockedEntra.startSignUp.mockResolvedValue({
        success: true,
        continuation_token: 'new-start-token',
      });

      mockedEntra.getChallenge.mockResolvedValue({
        success: true,
        continuation_token: 'new-challenge-token',
      });

      const req = createMockReq({
        emailAddress: 'test@example.com',
        otp: '123456',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(mockedEntra.startSignUp).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ otpSent: true });
    });

    it('returns 400 for invalid OTP', async () => {
      mockCookies('token');

      mockedEntra.submitOtp.mockResolvedValue({
        success: false,
        error: 'invalid_otp',
      });

      const req = createMockReq({
        emailAddress: 'test@example.com',
        otp: '000000',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        name: 'otp',
        error: 'invalid_otp',
      });
    });
  });

  describe('Unexpected errors', () => {
    it('returns 500 on unhandled exception', async () => {
      mockCookies();

      mockedEntra.startSignUp.mockRejectedValue(new Error('boom'));

      const req = createMockReq({
        emailAddress: 'test@example.com',
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An unexpected error occurred.',
      });
    });
  });
});
