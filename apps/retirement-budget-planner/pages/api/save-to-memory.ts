import { NextApiRequest, NextApiResponse } from 'next';

import { saveDataToMemory } from 'lib/util/cacheToRedis/incomeEssential';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { body } = request;

  let data = body;
  if (typeof body === 'string') {
    data = JSON.parse(body);
  }

  const { sessionId, tabName, sectionName, ...form } = data;

  try {
    saveDataToMemory(sessionId, form, tabName, sectionName);
    return response.status(200).json('The data are successfully saved');
  } catch (e: any) {
    throw new Error(e);
  }
}
