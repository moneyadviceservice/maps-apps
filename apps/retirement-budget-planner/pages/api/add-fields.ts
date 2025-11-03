import { NextApiRequest, NextApiResponse } from 'next';

import { retirementIncomefieldNames } from 'data/retirementIncomeData';
import { Partner } from 'lib/types/aboutYou';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis/aboutYouCache';
import {
  getDataFromMemory,
  saveDataToMemory,
} from 'lib/util/cacheToRedis/incomeEssential';
import {
  generateNewId,
  getGroupFieldConfigs,
} from 'lib/util/contentFilter/contentFilter';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {
    body,
    query: { sectionName, sessionId },
  } = request;
  const { language, tabName, dynamic, stepsEnabled } = body;

  try {
    const additionalData = await getDataFromMemory(
      sessionId as string,
      tabName,
    );

    const aboutyouData = await getPartnersFromRedis(sessionId as string);
    const partners = aboutyouData.map((p: Partner) => p.name);
    const newId = generateNewId(
      additionalData?.additionalFields,
      getGroupFieldConfigs(retirementIncomefieldNames, partners),
      String(sectionName),
    );

    await saveDataToMemory(
      sessionId as string,
      body,
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
