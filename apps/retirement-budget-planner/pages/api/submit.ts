import { NextApiRequest, NextApiResponse } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import {
  CACHED_DATA_NAME,
  getPageEnum,
  PAGES_NAMES,
} from 'lib/constants/pageConstants';
import { convertFormData } from 'lib/util/about-you';
import { getSessionId } from 'lib/util/get-session-id';
import { findNextStep, findNextStepName, findStep } from 'lib/util/tabs';
import { put } from 'memory-cache';

import { setPartnersInRedis } from './set-partner-details';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // use query params temporarily until redis is integrated
  const { query, body } = request;
  const { language, tabName, sessionId, ...rest } = request.body;

  const { stepName, stepsEnabled } = query;
  const params = { ...query };
  let newParams: Record<string, string> = {};

  let nextTab = stepName;
  let nextStep = 0;

  const pageName = getPageEnum(tabName);
  const newSessionId = getSessionId(sessionId);
  if (!newSessionId) {
    return response.status(400).json({ error: 'Session ID is missing' });
  }

  switch (pageName) {
    case PAGES_NAMES.ABOUTYOU: {
      const partners = convertFormData(rest);

      await setPartnersInRedis(partners, newSessionId);
      break;
    }
    case PAGES_NAMES.RETIREMENT:
      break;

    case PAGES_NAMES.SUMMARY:
      break;
  }

  if (stepName) {
    nextStep = findStep(TAB_NAMES, String(stepName));
  } else {
    nextTab = findNextStepName(TAB_NAMES, tabName);
    nextStep = findNextStep(TAB_NAMES, tabName);
  }

  if (tabName === PAGES_NAMES.ABOUTYOU) {
    put(CACHED_DATA_NAME, {
      [tabName]: {
        name: Array.isArray(body.name) ? body.name : [body.name],
      },
    });
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

  if (Object.entries(newParams).length > 0) {
    delete newParams['tabName'];
    delete newParams['stepName'];
  }

  response
    .status(200)
    .redirect(
      `/${language}/${nextTab}${
        Object.entries(newParams).length > 0
          ? '?' + new URLSearchParams(newParams).toString()
          : ''
      }`,
    );
}
