import { NextApiRequest, NextApiResponse } from 'next';

import { removeDataFromMemory } from 'lib/util/cacheToRedis/incomeEssential';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {
    body,
    query: { sectionName, id, sessionId },
  } = request;
  const { language, tabName, dynamic, stepsEnabled, ...rest } = body;

  try {
    await removeDataFromMemory(
      sessionId as string,
      rest,
      tabName,
      Number(id),
      String(sectionName),
    );
  } catch (e) {
    console.warn('Failed to remove item', e);
    if (dynamic)
      return response.status(500).json(`Failed to remove item ${id}`);
  }

  if (dynamic)
    return response.status(200).json(`Removed item ${id} successfully`);
  else {
    const params = new URLSearchParams();
    params.set('sessionId', String(sessionId));
    params.set('stepsEnabled', String(stepsEnabled));

    return response.redirect(`/${language}/${tabName}?${params}`);
  }
}
