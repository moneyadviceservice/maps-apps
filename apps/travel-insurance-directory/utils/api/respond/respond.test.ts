import { NextApiRequest, NextApiResponse } from 'next/types';

import Cookies from 'cookies';

import { wantsJson } from '../wantsJson';
import { respond } from './respond';

jest.mock('cookies');
jest.mock('../wantsJson');
const mockedWantsJson = wantsJson as jest.MockedFunction<typeof wantsJson>;

describe('respond utility', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockCookiesInstance: { set: jest.Mock; get: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
    mockCookiesInstance = {
      set: jest.fn(),
      get: jest.fn(),
    };
    (Cookies as unknown as jest.Mock).mockImplementation(
      () => mockCookiesInstance,
    );
  });

  it('should return JSON when wantsJson is true', () => {
    mockedWantsJson.mockReturnValue(true);
    const data = { success: true };

    respond(mockReq as NextApiRequest, mockRes as NextApiResponse, {
      status: 201,
      data,
    });

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(data);
    expect(mockRes.redirect).not.toHaveBeenCalled();
  });

  it('should apply custom headers in JSON mode', () => {
    mockedWantsJson.mockReturnValue(true);

    respond(mockReq as NextApiRequest, mockRes as NextApiResponse, {
      headers: { Allow: 'POST' },
    });

    expect(mockRes.setHeader).toHaveBeenCalledWith('Allow', 'POST');
  });

  it('should redirect when wantsJson is false', () => {
    mockedWantsJson.mockReturnValue(false);

    respond(mockReq as NextApiRequest, mockRes as NextApiResponse, {
      redirect: '/target',
      redirectStatus: 302,
    });

    expect(mockRes.redirect).toHaveBeenCalledWith(302, '/target');
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should set an error cookie when status is >= 400 and wantsJson is false', () => {
    mockedWantsJson.mockReturnValue(false);
    const errorData = { error: 'invalid_otp' };

    respond(mockReq as NextApiRequest, mockRes as NextApiResponse, {
      status: 400,
      data: errorData,
    });

    expect(mockCookiesInstance.set).toHaveBeenCalledWith(
      'form_error',
      JSON.stringify(errorData),
      {
        httpOnly: false,
      },
    );

    expect(mockRes.redirect).toHaveBeenCalled();
  });

  it('should NOT set an error cookie when status is 200', () => {
    mockedWantsJson.mockReturnValue(false);

    respond(mockReq as NextApiRequest, mockRes as NextApiResponse, {
      status: 200,
    });

    const setHeaderCalls = (mockRes.setHeader as jest.Mock).mock.calls;
    const hasErrorCookie = setHeaderCalls.some(
      (call) => call[0] === 'Set-Cookie',
    );
    expect(hasErrorCookie).toBe(false);
  });
});
