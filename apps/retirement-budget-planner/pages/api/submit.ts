import { NextApiRequest, NextApiResponse } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import { CACHED_DATA_NAME, PAGES_NAMES } from 'lib/constants/pageConstants';
import { findNextStep, findNextStepName, findStep } from 'lib/util/tabs';
import { put } from 'memory-cache';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // use query params temporarily until redis is integrated
  const { query, body } = request;
  const { language, tabName } = body;

  const { stepName, stepsEnabled } = query;
  const params = { ...query };
  let newParams: Record<string, string> = {};

  let nextTab = stepName;
  let nextStep = 0;

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
    newParams = { ...params, stepsEnabled: String(stepsEnabled) };
  } else newParams = { ...params, stepsEnabled: String(nextStep) };

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
