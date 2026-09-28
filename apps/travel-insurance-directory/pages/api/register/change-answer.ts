import { NextApiRequest, NextApiResponse } from 'next';

import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { pageStep, pagePath } = req.body || {};

  try {
    if (!pageStep || !pagePath) {
      throw new Error('Missing required body parameters');
    }

    const nextPage = `${pagePath}/${pageStep}?change=true`;

    return respond(req, res, {
      data: { success: true, nextPath: nextPage },
      redirect: nextPage,
    });
  } catch (err) {
    console.error('Error in firm radio submit handler:', err);

    return respond(req, res, {
      status: 500,
      data: errorFormat({ [pageStep]: { error: 'general_error' } }),
      redirect: '/register/confirm-details',
    });
  }
}
