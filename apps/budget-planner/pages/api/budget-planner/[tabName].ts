import type { NextApiRequest, NextApiResponse } from 'next';

import cacheData from 'memory-cache';
import { saveDataToCache } from 'utils/cacheInMemory/cacheInMemory';
import { uncompress } from 'utils/compress';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { query, body } = request;
  const { locale, isEmbedded, ckey, currentTab, sessionID, ...formData } = body;
  let submittedData = formData;
  const { save } = query;
  const isResetRoute = query.tabName === 'reset';
  const tabName = isResetRoute ? 'income' : query.tabName;
  // @note: Remove the summary data from the form data because it is duplicating stored data.
  if (formData['storedData']) {
    submittedData = JSON.parse(formData['storedData']);
  }
  const trasnformFormData =
    currentTab !== 'summary' ? { [currentTab]: submittedData } : {};

  let cacheKey = ckey?.toString();

  if (!ckey || ckey.length === 0) {
    cacheKey = uuidv4().replace(/-/g, '');
  }

  const sessionData = cacheData.get(
    `budget-planner_session__${sessionID}`,
  )?.cache;
  const cachedData = cacheData.get(`budget-planner_${cacheKey}`)?.cache;

  let newData;

  if (isResetRoute) {
    newData = {};
  } else if (cachedData) {
    newData = {
      ...JSON.parse(await uncompress(cachedData)),
      ...trasnformFormData,
    };
  } else {
    newData = { ...trasnformFormData };
  }

  const newQuery = new URLSearchParams({
    isEmbedded,
  });

  if (cacheKey) newQuery.set('ckey', cacheKey);
  if (!isResetRoute && sessionID) newQuery.set('sessionID', sessionID);
  if (isResetRoute) newQuery.set('reset', 'true');
  else newQuery.set('reset', 'false');

  saveDataToCache({ ...sessionData, ...newData }, `budget-planner_${cacheKey}`);

  if (save) {
    // @note: Redirect to the save page.
    newQuery.set('tabName', String(currentTab));
    response.redirect(303, `/${locale}/budget-planner/save?${newQuery}`);
  } else {
    // @note: Redirect back to the target page.
    response.redirect(303, `/${locale}/budget-planner/${tabName}?${newQuery}`);
  }
}
