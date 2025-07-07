import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next/types';

import { login } from 'lib/auth/provider';

import handler from './signin';

jest.mock('lib/auth/utils/withSession', () => ({
  withSession: (handlerFn: NextApiHandler) => handlerFn,
}));

jest.mock('lib/auth/provider', () => ({
  login: jest.fn(),
}));

describe('/api/auth/signin', () => {
  const mockReq = {
    method: 'GET',
    query: {},
    headers: {},
  } as NextApiRequest;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    end: jest.fn(),
  } as unknown as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const callHandlerWithRedirect = async (
    queryRedirect: string | undefined,
    referer: string | undefined,
    expectedRedirect: string,
  ) => {
    mockReq.query = queryRedirect ? { redirectTo: queryRedirect } : {};
    mockReq.headers.referer = referer ?? '';

    await handler(mockReq, mockRes);

    expect(login).toHaveBeenCalledWith(mockReq, mockRes, {
      redirectTo: expectedRedirect,
    });
  };

  it('calls signIn with GET request and redirectTo', async () => {
    await callHandlerWithRedirect('/dashboard', undefined, '/dashboard');
  });

  it('uses referer if no query redirectTo', async () => {
    await callHandlerWithRedirect(undefined, '/referer-url', '/referer-url');
  });

  it('returns 405 on non-GET method', async () => {
    mockReq.method = 'POST';

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalled();
  });
});
