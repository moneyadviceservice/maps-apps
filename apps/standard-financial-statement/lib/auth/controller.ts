import type { NextApiRequest, NextApiResponse } from 'next';

import {
  handleRedirect as handleRedirectProvider,
  login,
  logout,
} from './provider';

export const signIn = async (
  req: NextApiRequest,
  res: NextApiResponse,
  options?: { redirectTo?: string },
): Promise<void> => {
  return login(req, res, options);
};

export const handleRedirect = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  return handleRedirectProvider(req, res);
};

export const signOut = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  return logout(req, res);
};
