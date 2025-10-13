import { NextApiRequest, NextApiResponse } from 'next';

import { retirementIncomefieldNames } from 'data/retirementIncomeData';
import {
  getAdditionalDataFromMemory,
  saveDataToMemory,
} from 'lib/util/cache/cache';
import {
  generateNewId,
  getGroupFieldConfigs,
  getPartnersNames,
} from 'lib/util/contentFilter/contentFilter';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {
    body,
    query: { sectionName },
  } = request;
  const { language, tabName } = body;

  try {
    const additionalData = getAdditionalDataFromMemory(tabName);
    const partners = getPartnersNames();
    const newId = generateNewId(
      additionalData,
      getGroupFieldConfigs(retirementIncomefieldNames, partners),
      String(sectionName),
    );

    saveDataToMemory(body, tabName, String(sectionName), newId);
  } catch (e) {
    console.warn('Failed to add item', e);
  }

  return response.redirect(`/${language}/${tabName}`);
}
