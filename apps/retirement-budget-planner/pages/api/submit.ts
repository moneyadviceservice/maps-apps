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

const generateParamsOnError = (params: Record<string, string>) =>
  Object.entries(params).length > 0
    ? '?' + new URLSearchParams(params).toString()
    : '';
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { query, body } = request;
  const { language, tabName, sessionId, sectionName, ...rest } = request.body;

  const { stepName, stepsEnabled } = query;
  const params = { ...query };
  let newParams: Record<string, string> = {},
    nextTab = stepName,
    nextStep = 0,
    error = false,
    finalRedirectUrl = '';
  const pageName = getPageEnum(tabName),
    newSessionId = getSessionId(sessionId);
  if (!newSessionId) {
    return response.status(400).json({ error: 'Session ID is missing' });
  }

  if (pageName === PAGES_NAMES.ABOUTYOU) {
    error = await saveAboutYouPageData(rest, newSessionId);
    if (error) {
      newParams = {
        ...params,
        error: error.toString(),
        sessionId: newSessionId,
      };
      const paramsToAdd = generateParamsOnError(newParams);
      finalRedirectUrl = `/${language}/${tabName}${paramsToAdd}`;
    }
  } else if (tabName !== PAGES_NAMES.SUMMARY) {
    saveDataToMemory(body, tabName, sectionName);
  }

  if (stepName) {
    nextStep = findStep(TAB_NAMES, String(stepName));
  } else {
    nextTab = findNextStepName(TAB_NAMES, tabName);
    nextStep = findNextStep(TAB_NAMES, tabName);
  }

  if (Number(stepsEnabled) >= nextStep) {
    newParams = {
      ...params,
      stepsEnabled: String(stepsEnabled),
      sessionId: newSessionId,
    };
  } else
    newParams = {
      ...params,
      stepsEnabled: String(nextStep),
      sessionId: newSessionId,
    };

  if (!error) {
    delete newParams['tabName'];
    delete newParams['stepName'];
    delete newParams['error'];
    finalRedirectUrl = `/${language}/${nextTab}${
      Object.entries(newParams).length > 0
        ? '?' + new URLSearchParams(newParams).toString()
        : ''
    }`;
  }

  return response.status(200).redirect(finalRedirectUrl);
}
