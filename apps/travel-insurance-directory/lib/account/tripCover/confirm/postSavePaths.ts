import type { NextApiRequest } from 'next';

import { parseIsChangeAnswer } from 'lib/account/shared/parseIsChangeAnswer';

import { confirmPath } from '../steps/tripCoverRoutes';

export function resolveChangeAnswerPostSavePath(firmId: string): string {
  return confirmPath(firmId);
}

export function resolveTripCoverPostSavePath(
  req: NextApiRequest,
  firmId: string,
  defaultNext: string,
): string {
  if (firmId && parseIsChangeAnswer(req)) {
    return resolveChangeAnswerPostSavePath(firmId);
  }

  return defaultNext;
}
