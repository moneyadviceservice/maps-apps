import { NextApiRequest, NextApiResponse } from 'next';

import { saveDataToMemory } from 'lib/util/cacheToRedis/incomeEssential';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {
    body,
    query: { sectionName, fieldName, sessionId, maxIndex },
  } = request;
  const { language, tabName, dynamic, stepsEnabled, ...formData } = body;

  try {
    const maxItemIndex =
      Array.isArray(maxIndex) || maxIndex === undefined
        ? null
        : Number.parseInt(maxIndex) + 1;

    await saveDataToMemory(
      sessionId as string,
      formData,
      tabName,
      String(sectionName),
      String(fieldName),
      maxItemIndex,
    );
  } catch (e) {
    console.warn('Failed to add item', e);
    if (dynamic)
      return response.status(500).json({ message: 'Failed to add item' });
  }

  if (dynamic) return response.status(200).json('Saved data');
  else {
    const params = new URLSearchParams();
    params.set('sessionId', String(sessionId));
    params.set('stepsEnabled', String(stepsEnabled));
    response.redirect(`/${language}/${tabName}?${params}`);
  }
}
