import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { logoutUser } from './logoutUser';

jest.mock('cookies');

describe('logoutUser', () => {
  let req: NextApiRequest;
  let res: NextApiResponse;
  let cookies: jest.Mocked<Cookies>;

  beforeEach(() => {
    req = {} as NextApiRequest;
    res = {} as NextApiResponse;
    cookies = new Cookies(req, res) as jest.Mocked<Cookies>;
    (Cookies as unknown as jest.Mock).mockImplementation(() => cookies);
  });

  it('should clear all relevant cookies', () => {
    logoutUser(req, res);
    expect(cookies.set).toHaveBeenCalledWith('userSessionId', '');
    expect(cookies.set).toHaveBeenCalledWith('codeVerifier', '');
    expect(cookies.set).toHaveBeenCalledWith('redirectUrl', '');
    expect(cookies.set).toHaveBeenCalledWith('authorizationCode', '');
    expect(cookies.set).toHaveBeenCalledWith('currentUrl', '');
    expect(cookies.set).toHaveBeenCalledWith('currentSupportUrl', '');
    expect(cookies.set).toHaveBeenCalledWith('channel', '');
  });
});
