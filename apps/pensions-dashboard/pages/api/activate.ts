import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const host = request.headers.host;
  const protocol = request.headers['x-forwarded-proto'] || 'https';
  const ERROR = `${protocol}://${host}/en/link-access-error`;
  const token = request.query.linkId as string | undefined;

  // if not enabled for secure beta access, redirect to home page
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    response.redirect(302, '/');
    return;
  }

  // if no access service URL or token is not provided, redirect to error page
  if (!process.env.MHPD_BETA_ACCESS_SERVICE || !token) {
    response.redirect(302, ERROR);
    return;
  }

  // otherwise redirect to the beta access activation service with the token
  const redirectUrl = `${
    process.env.MHPD_BETA_ACCESS_SERVICE
  }/activate?linkId=${encodeURIComponent(token)}`;
  response.redirect(302, redirectUrl);
}
