import { NextApiRequest, NextApiResponse } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import { getPageEnum, PAGES_NAMES } from 'lib/constants/pageConstants';
import { convertFormData, findPartnerById } from 'lib/util/about-you';
import { saveDataToMemory } from 'lib/util/cache/cache';
import { getSessionId } from 'lib/util/get-session-id';
import { findNextStep, findNextStepName, findStep } from 'lib/util/tabs';
import { validateForm } from 'lib/validation/partner';

import { setPartnersInRedis } from './set-partner-details';

const saveAboutYouPageData = async (data: any, newSessionId: string) => {
  let error = false;
  const partners = convertFormData(data);

  await setPartnersInRedis(partners, newSessionId);
  const partner1 = findPartnerById(partners, 1);
  if (partner1) {
    const validationErrors = validateForm(partner1);
    error = !!validationErrors;
  }
  return error;
};

const generateParams = (params: Record<string, string>) =>
  Object.entries(params).length > 0
    ? '?' + new URLSearchParams(params).toString()
    : '';

export const handleAboutYouPage = async (
  pageName: string,
  tabName: string,
  rest: any,
  newSessionId: string,
  language: string,
  query: Partial<{
    [key: string]: string | string[];
  }>,
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
      finalRedirectUrl = `/${language}/${tabName}${generateParams(newParams)}`;
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
  const updatedStepsEnabled = Math.max(stepsEnabledNum, nextStep);

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
  newSessionId: string,
  newParams: Record<string, string>,
) => {
  let finalRedirectUrl = '';
  const save = query.save === 'true' ? 'true' : 'false';

  if (!error) {
    delete newParams['save'];
    delete newParams['error'];

    if (save === 'true') {
      finalRedirectUrl = `/${language}/save${generateParams({
        ...query,
        tabName,
        sessionId: newSessionId,
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
  const { language, tabName, sessionId, sectionName, ...rest } = request.body;

  const { stepName, stepsEnabled } = query;

  const pageName = getPageEnum(tabName),
    newSessionId = getSessionId(sessionId);

  const {
    error,
    finalRedirectUrl: errorRedirectUrl,
    newParams,
  } = await handleAboutYouPage(
    pageName,
    tabName,
    rest,
    newSessionId,
    language,
    query,
  );

  if (tabName !== PAGES_NAMES.SUMMARY && pageName !== PAGES_NAMES.ABOUTYOU) {
    saveDataToMemory(body, tabName, sectionName);
  }

  const { nextTab, updatedStepsEnabled } = handleStepNavigation(
    tabName,
    stepName,
    stepsEnabled,
  );

  const finalRedirectUrl = error
    ? errorRedirectUrl
    : handleFinalRedirect(
        error,
        query,
        language,
        tabName,
        nextTab,
        newSessionId,
        {
          ...newParams,
          stepsEnabled: updatedStepsEnabled.toString(),
          sessionId: newSessionId,
        },
      );

  return response.status(200).redirect(finalRedirectUrl);
}
