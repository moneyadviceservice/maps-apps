import type { NextApiRequest } from 'next';

import { firstString } from 'utils/formValue';

export const isJsonRequest = (request: NextApiRequest) =>
  String(request.headers['content-type'] ?? '').includes('application/json');

export const requestField = (request: NextApiRequest, key: string) => {
  const body = (request.body ?? {}) as Record<string, unknown>;
  return firstString(request.query[key]) ?? firstString(body[key]);
};
