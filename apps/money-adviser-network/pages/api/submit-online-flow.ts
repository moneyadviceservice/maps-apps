import type { NextApiRequest, NextApiResponse } from 'next';

import { PAGES } from 'CONSTANTS';

import { getCurrentPath } from '../../utils/getCurrentPath';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { language, currentFlow } = req.body;

  const currentPath = getCurrentPath(currentFlow);

  res.redirect(302, `/${language}/${currentPath}/${PAGES.DETAILS_SENT}`);
}
