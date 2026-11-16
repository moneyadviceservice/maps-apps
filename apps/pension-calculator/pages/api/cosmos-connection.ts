import type { NextApiRequest, NextApiResponse } from 'next';

import { cosmosConnection } from 'lib/cosmos';

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse,
) {
  const connected = await cosmosConnection();

  response.status(connected ? 200 : 503).json({ connected });
}
