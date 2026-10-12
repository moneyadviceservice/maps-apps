import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import handler from 'pages/api/account-auth/reset';

jest.mock('cookies');

const mockedCookies = Cookies as jest.MockedClass<typeof Cookies>;
let cookieInstance: { get: jest.Mock; set: jest.Mock };

function createMockRes(): NextApiResponse {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
}

const defaultHeader = {
  'content-type': 'application/json',
};

function createMockReq(method = 'POST'): NextApiRequest {
  return {
    method,
    headers: defaultHeader,
    body: {},
  } as NextApiRequest;
}

function mockCookies() {
  cookieInstance = {
    get: jest.fn(),
    set: jest.fn(),
  };
  mockedCookies.mockImplementation(() => cookieInstance as unknown as Cookies);
}

describe('/api/account-auth/reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies();
  });

  it('returns 405 for non-POST requests', async () => {
    const req = createMockReq('GET');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
  });

  it('clears continuation cookie and returns success', async () => {
    const req = createMockReq('POST');
    const res = createMockRes();

    await handler(req, res);

    expect(cookieInstance.set).toHaveBeenCalledWith(
      'account_continuation_token',
      '',
      expect.objectContaining({ path: '/', expires: expect.any(Date) }),
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});
