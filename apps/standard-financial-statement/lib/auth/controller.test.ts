import { NextApiRequest, NextApiResponse } from 'next';

import { handleRedirect, signIn, signOut } from './controller';
import * as provider from './provider';

describe('Auth Controllers', () => {
  const req = {} as NextApiRequest;
  const res = {} as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call login with provided req, res and options', async () => {
      const loginMock = jest.spyOn(provider, 'login').mockResolvedValue();

      const options = { redirectTo: '/dashboard' };
      await signIn(req, res, options);

      expect(loginMock).toHaveBeenCalledWith(req, res, options);
    });
  });

  describe('handleRedirect', () => {
    it('should call handleRedirectProvider with req and res', async () => {
      const redirectMock = jest
        .spyOn(provider, 'handleRedirect')
        .mockResolvedValue();

      await handleRedirect(req, res);

      expect(redirectMock).toHaveBeenCalledWith(req, res);
    });
  });

  describe('signOut', () => {
    it('should call logout with req and res', async () => {
      const logoutMock = jest.spyOn(provider, 'logout').mockResolvedValue();

      await signOut(req, res);

      expect(logoutMock).toHaveBeenCalledWith(req, res);
    });
  });
});
