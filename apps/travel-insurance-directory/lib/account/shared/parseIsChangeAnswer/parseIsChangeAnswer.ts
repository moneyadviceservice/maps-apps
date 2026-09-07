import { NextApiRequest } from 'next/types';

export function parseIsChangeAnswer(req: NextApiRequest): boolean {
  return (
    req.query?.isChangeAnswer === 'true' || req.body?.isChangeAnswer === 'true'
  );
}
