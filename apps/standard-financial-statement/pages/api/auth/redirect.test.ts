import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next/types';

import { handleRedirect } from 'lib/auth/controller';

import handler from './redirect';

jest.mock('lib/auth/controller', () => ({
  handleRedirect: jest.fn(),
}));

jest.mock('lib/auth/withSession', () => ({
  withSession: (handlerFn: NextApiHandler) => handlerFn,
}));

describe('/api/auth/signin', () => {
  const mockReq = {
    method: 'POST',
  } as NextApiRequest;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    end: jest.fn(),
  } as unknown as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls handleRedirect on POST', async () => {
    await handler(mockReq, mockRes);

    expect(handleRedirect).toHaveBeenCalledWith(mockReq, mockRes);
  });

  it('returns 405 on non-POST method', async () => {
    mockReq.method = 'GET';

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalled();
  });
});
