import { NextApiRequest, NextApiResponse } from 'next/types';

import Cookies from 'cookies';

import { wantsJson } from '../wantsJson';

export const respond = (
  req: NextApiRequest,
  res: NextApiResponse,
  {
    status = 200,
    data = {},
    redirect = '/',
    redirectStatus = 303,
    headers = {} as Record<string, string>,
  },
) => {
  // 1. Apply any custom headers (like 'Allow')
  headers &&
    Object.entries(headers).forEach(([key, value]) =>
      res.setHeader(key, value),
    );

  if (wantsJson(req)) {
    return res.status(status).json(data);
  }

  // 2. No-JS Fallback Logic
  // If it's an error (4xx or 5xx), sync to cookie automatically
  if (status >= 400) {
    const cookies = new Cookies(req, res);

    cookies.set('form_error', JSON.stringify(data), {
      httpOnly: false,
    });
  }

  return res.redirect(redirectStatus, redirect);
};
