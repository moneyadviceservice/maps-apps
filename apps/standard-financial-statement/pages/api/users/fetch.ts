import type { NextApiRequest, NextApiResponse } from 'next';

import { handleCommonUserLookup } from 'lib/entra/commonUserOperations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { validUsers, errorResponse } = await handleCommonUserLookup(req, res);

  if (errorResponse) {
    return res.status(errorResponse.status).json({
      message: errorResponse.message,
      details: errorResponse.details,
    });
  }

  return res.status(200).json({
    message: 'Users fetched successfully.',
    users: validUsers,
  });
}
