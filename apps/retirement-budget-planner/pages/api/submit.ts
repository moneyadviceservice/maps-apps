import { NextApiRequest, NextApiResponse } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import { getPageEnum, PAGES_NAMES } from 'lib/constants/pageConstants';
import { convertFormData } from 'lib/util/about-you';
import { setPartnersInRedis } from 'lib/util/cacheToRedis';
import { saveDataToMemory } from 'lib/util/cacheToRedis/incomeEssential';
import { validateFormInputNames } from 'lib/util/contentFilter/contentFilter';
import { getSessionId } from 'lib/util/get-session-id';
import { findNextStep, findNextStepName, findStep } from 'lib/util/tabs';
import { validatePartner } from 'lib/validation/partner';

const DEFAULT_STEP_NUMBER = 1;

const saveAboutYouPageData = async (data: any, newSessionId: string) => {
  const partner = convertFormData(data);

  await setPartnersInRedis(partner, newSessionId);

  const validationErrors = validatePartner(partner);
  return !!validationErrors;
};

const generateParams = (params: Record<string, string>) =>
  Object.entries(params).length > 0
    ? '?' + new URLSearchParams(params).toString()
    : '';

export const handlePages = async (
  pageName: string,
  rest: Record<string, string>,
  newSessionId: string,
  language: string,
  query: Partial<{
    [key: string]: string | string[];
  }>,
  stepsEnabled: number,
  tabId: number,
) => {
  let error = false;
  const params = { ...query };
  let newParams: Record<string, string> = {};
  let finalRedirectUrl = '';

  if (pageName === PAGES_NAMES.ABOUTYOU) {
    error = await saveAboutYouPageData(rest, newSessionId);
    if (error) {
      newParams = {
        ...params,
        error: error.toString(),
        sessionId: newSessionId,
      };
      finalRedirectUrl = `/${language}/${pageName}${generateParams(newParams)}`;
    }
  }

  if (pageName !== PAGES_NAMES.SUMMARY && pageName !== PAGES_NAMES.ABOUTYOU) {
    if (validateFormInputNames(rest)) {
      const { sectionName, ...properties } = rest;
      try {
        await saveDataToMemory(newSessionId, properties, pageName, sectionName);
      } catch (e) {
        console.error(e);
      }
    } else {
      if (tabId === stepsEnabled) error = true;
      newParams = {
        error: String(error),
        sessionId: newSessionId,
        stepsEnabled: String(stepsEnabled),
      };
      finalRedirectUrl = `/${language}/${pageName}${generateParams(newParams)}`;
    }
  }

  return { error, finalRedirectUrl, newParams };
};
export const handleStepNavigation = (
  tabName: string,
  stepName: string | string[] | undefined,
  stepsEnabled: string | string[] | undefined,
) => {
  let nextStep = 0;
  const nextTab = stepName
    ? String(stepName)
    : findNextStepName(TAB_NAMES, tabName);

  nextStep = stepName
    ? findStep(TAB_NAMES, String(stepName))
    : findNextStep(TAB_NAMES, tabName);

  const stepsEnabledNum = Number(stepsEnabled);

  const updatedStepsEnabled = Math.max(
    stepsEnabledNum ?? DEFAULT_STEP_NUMBER,
    nextStep,
  );

  return { nextTab, updatedStepsEnabled };
};

export const handleFinalRedirect = (
  error: boolean,
  query: Partial<{
    [key: string]: string | string[];
  }>,
  language: string,
  tabName: string,
  nextTab: string,
  newParams: Record<string, string>,
  redirectOnError: string,
) => {
  let finalRedirectUrl = '';
  const save = query.save === 'true' ? 'true' : 'false';

  if (error) {
    return redirectOnError;
  } else {
    delete newParams['save'];
    delete newParams['error'];

    if (save === 'true') {
      finalRedirectUrl = `/${language}/save${generateParams({
        ...query,
        tabName,
        sessionId: newParams.sessionId,
        stepsEnabled: newParams.stepsEnabled,
      })}`;
    } else {
      delete newParams['tabName'];
      delete newParams['stepName'];

      finalRedirectUrl = `/${language}/${nextTab}${generateParams(newParams)}`;
    }
  }

  return finalRedirectUrl;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { query, body } = request;
  const { language, tabName, stepsEnabled, sessionId, ...rest } = body;

  const { stepName } = query;

  const pageName = getPageEnum(tabName),
    newSessionId = getSessionId(sessionId);
  const tabId = findStep(TAB_NAMES, tabName);

  const {
    error,
    finalRedirectUrl: errorRedirectUrl,
    newParams,
  } = await handlePages(
    pageName,
    rest,
    newSessionId,
    language,
    query,
    Number(stepsEnabled),
    tabId,
  );

  const { nextTab, updatedStepsEnabled } = handleStepNavigation(
    tabName,
    stepName,
    stepsEnabled,
  );

  const finalRedirectUrl = handleFinalRedirect(
    error,
    query,
    language,
    tabName,
    nextTab,
    {
      ...newParams,
      stepsEnabled: updatedStepsEnabled.toString(),
      sessionId: newSessionId,
    },
    errorRedirectUrl,
  );

  return response.status(200).redirect(finalRedirectUrl);
}
