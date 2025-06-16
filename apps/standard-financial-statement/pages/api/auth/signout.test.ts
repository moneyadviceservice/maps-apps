import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next/types';

import { signOut } from 'lib/auth/controller';

import handler from './signout';

jest.mock('lib/auth/controller', () => ({
  signOut: jest.fn(),
}));

jest.mock('lib/auth/withSession', () => ({
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

    expect(signOut).toHaveBeenCalledWith(mockReq, mockRes);
  });

  it('returns 405 on non-GET method', async () => {
    await callHandlerWith('POST');

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalled();
  });
});
