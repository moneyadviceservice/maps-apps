import { NextApiRequest, NextApiResponse } from 'next';

import { retirementIncomefieldNames } from 'data/retirementIncomeData';
import {
  getDataFromMemory,
  saveDataToMemory,
} from 'lib/util/cacheToRedis/incomeEssential';
import { generateNewId } from 'lib/util/contentFilter/contentFilter';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {
    body,
    query: { sectionName, sessionId },
  } = request;
  const { language, tabName, dynamic, stepsEnabled, ...formData } = body;

  try {
    const additionalData = await getDataFromMemory(
      sessionId as string,
      tabName,
    );

    const newId = generateNewId(
      additionalData?.additionalFields,
      retirementIncomefieldNames(),
      String(sectionName),
    );

    await saveDataToMemory(
      sessionId as string,
      formData,
      tabName,
      String(sectionName),
      newId,
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
