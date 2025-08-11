import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next/types';

import { logout } from 'lib/auth/provider';

import handler from './signout';

jest.mock('lib/auth/provider', () => ({
  logout: jest.fn(),
}));

jest.mock('lib/auth/utils/withSession', () => ({
  withSession: (handlerFn: NextApiHandler) => handlerFn,
}));

describe('/api/auth/signOut', () => {
  let mockReq: NextApiRequest;
  let mockRes: NextApiResponse;

  const callHandlerWith = async (
    method: string,
    query: Record<string, string> = {},
    headers: Record<string, string> = {},
  ) => {
    mockReq = {
      method,
      query,
      headers,
    } as unknown as NextApiRequest;

    mockRes = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    await handler(mockReq, mockRes);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls signOut on GET', async () => {
    await callHandlerWith('GET', {});

    expect(logout).toHaveBeenCalledWith(mockReq, mockRes);
  });

  it('returns 405 on non-GET method', async () => {
    await callHandlerWith('POST');

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalled();
  });
});
