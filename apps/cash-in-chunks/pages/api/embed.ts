import { NextApiRequest, NextApiResponse } from 'next';

import embedHandler from '@maps-react/utils/generateEmbedCode/embed';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return embedHandler(req, res);
}
