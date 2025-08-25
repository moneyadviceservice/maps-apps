import { NextApiRequest, NextApiResponse } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import { findNextStep, findNextStepName, findStep } from 'lib/util/tabs';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // use query params temporarily until redis is integrated
  const { language, tabName } = request.body;
  const { query } = request;
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
