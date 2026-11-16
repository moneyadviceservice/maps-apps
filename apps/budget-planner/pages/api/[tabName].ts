import type { NextApiRequest, NextApiResponse } from 'next';

import { v4 as uuidv4 } from 'uuid';

import {
  fetchDataFromCache,
  saveDataToCache,
} from '../../lib/netlify/netlifyBlob';

function getCacheKey(ckey: any): string {
  const keyString = ckey?.toString();
  if (!keyString || keyString.length === 0) {
    return uuidv4().replace(/-/g, '');
  }
  return keyString;
}

function buildNewData(
  isResetRoute: boolean,
  cachedData: any,
  currentTab: string,
  submittedData: any,
) {
  if (isResetRoute) {
    return {};
  }

  const transformFormData =
    currentTab !== 'summary' ? { [currentTab]: submittedData } : {};

  if (cachedData && Object.keys(cachedData).length > 0) {
    return { ...cachedData, ...transformFormData };
  }

  return { ...transformFormData };
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { query, body } = request;
  const { locale, isEmbedded, ckey, currentTab, sessionID, ...formData } = body;
  const { save } = query;
  const isResetRoute = query.tabName === 'reset';
  const tabName = isResetRoute ? 'income' : query.tabName;

  // @note: Remove the summary data from the form data because it is duplicating stored data.
  const submittedData = formData['storedData']
    ? JSON.parse(formData['storedData'])
    : formData;

  const cacheKey = getCacheKey(ckey);

  const sessionData = await fetchDataFromCache(
    `budget-planner_session__${sessionID}`,
  );
  const cachedData = await fetchDataFromCache(`budget-planner_${cacheKey}`);

  const newData = buildNewData(
    isResetRoute,
    cachedData,
    currentTab,
    submittedData,
  );

  const newQuery = new URLSearchParams({
    isEmbedded,
  });

  if (cacheKey) newQuery.set('ckey', cacheKey);
  if (!isResetRoute && sessionID) newQuery.set('sessionID', sessionID);
  newQuery.set('reset', isResetRoute ? 'true' : 'false');

  const dataToSave =
    sessionData && Object.keys(sessionData).length > 0
      ? { ...sessionData, ...newData }
      : newData;

  await saveDataToCache(dataToSave, `budget-planner_${cacheKey}`);

  if (save) {
    // @note: Redirect to the save page.
    newQuery.set('tabName', String(currentTab));
    response.redirect(303, `/${locale}/save?${newQuery}`);
  } else {
    // @note: Redirect back to the target page.
    response.redirect(303, `/${locale}/${tabName}?${newQuery}`);
  }
}
