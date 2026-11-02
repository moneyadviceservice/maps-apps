import { NextApiRequest } from 'next';

export function wantsJson(req: NextApiRequest) {
  return req.headers['content-type']?.includes('application/json');
}
