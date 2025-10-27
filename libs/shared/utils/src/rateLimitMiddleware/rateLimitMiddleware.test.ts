import { NextApiRequest, NextApiResponse } from 'next';

import { Socket } from 'net';

import { rateLimitMiddleware } from './rateLimitMiddleware';

const mockHandler = jest.fn((req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send('OK');
});

describe('rateLimitMiddleware', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    req = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' } as Socket,
    };
    statusMock = jest.fn();
    sendMock = jest.fn();
    res = {
      status: statusMock.mockReturnValue({ send: sendMock }),
      send: sendMock,
    };
  });

  it('should allow requests under the limit', () => {
    const middleware = rateLimitMiddleware(mockHandler);
    for (let i = 0; i < 5; i++) {
      middleware(req as NextApiRequest, res as NextApiResponse);
    }
    expect(mockHandler).toHaveBeenCalledTimes(5);
  });

  it('should block requests over the limit', () => {
    req = {
      headers: {},
      socket: { remoteAddress: '127.0.0.2' } as Socket,
    };
    const middleware = rateLimitMiddleware(mockHandler);
    for (let i = 0; i < 6; i++) {
      middleware(req as NextApiRequest, res as NextApiResponse);
    }
    expect(mockHandler).toHaveBeenCalledTimes(5);
    expect(statusMock).toHaveBeenCalledWith(429);
    expect(sendMock).toHaveBeenCalledWith('Too Many Requests');
  });

  it('should reset the request count after the window has passed', async () => {
    req = {
      headers: {},
      socket: { remoteAddress: '127.0.0.3' } as Socket,
    };
    const middleware = rateLimitMiddleware(mockHandler);
    for (let i = 0; i < 5; i++) {
      middleware(req as NextApiRequest, res as NextApiResponse);
    }
    jest.advanceTimersByTime(60001); // Move time forward over 1 minute
    middleware(req as NextApiRequest, res as NextApiResponse);
    expect(mockHandler).toHaveBeenCalledTimes(6);
  });
});
