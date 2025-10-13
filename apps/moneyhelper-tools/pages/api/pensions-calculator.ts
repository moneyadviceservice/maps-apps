import { NextApiRequest, NextApiResponse } from 'next';

import { validatePensionInputs } from 'data/workplace-pension-calculator';
import { StepName } from 'data/workplace-pension-calculator/pension-data';
import { ErrorObject } from 'data/workplace-pension-calculator/pension-validation';
import { getToolPath } from 'utils/getToolPath';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { dataPath, isEmbed, language, currentStep } = request.body;

  const isEmbedBool = isEmbed === 'true';
  const mainPath = getToolPath(dataPath);

  const transformedData = parseFormQuestions(request);
  const errors = validatePensionInputs(transformedData);
  const stepName = navigationRules(currentStep, errors);
  transformedData.currentStep = stepName;

  response.redirect(
    302,
    `/${language}${mainPath}calculator?${queryStringFormat(
      transformedData,
    )}${addEmbedQuery(isEmbedBool, '&')}`,
  );
}

export const navigationRules = (
  currentStepName: StepName,
  errors: ErrorObject,
) => {
  const error = Object.keys(errors).length > 0;

  if (error) {
    if (
      errors['age'] ||
      errors['salary'] ||
      errors['frequency'] ||
      errors['contributionType']
    ) {
      return StepName.DETAILS;
    }

    if (
      errors['contribution'] ||
      errors['employeeContribution'] ||
      errors['employerContribution']
    ) {
      return StepName.CONTRIBUTIONS;
    }
  }

  if (!currentStepName) {
    return StepName.DETAILS;
  }

  let stepName = currentStepName;

  if (stepName === StepName.DETAILS) {
    stepName = StepName.CONTRIBUTIONS;
  } else if (stepName === StepName.CONTRIBUTIONS) {
    stepName = StepName.RESULTS;
  }

  return stepName;
};

export const parseFormQuestions = (request: NextApiRequest) => {
  const { savedData } = request.body;

  const data = JSON.parse(savedData);
  let transformedData = { ...data };

  const {
    age,
    salary,
    frequency,
    contributionType,
    employeeContribution,
    employerContribution,
    results,
  } = request.body;

  transformedData = {
    ...transformedData,
    age: age ?? transformedData.age,
    salary: salary ?? transformedData.salary,
    frequency: frequency ?? transformedData.frequency,
    contributionType: contributionType ?? transformedData.contributionType,
    employeeContribution: employeeContribution ?? '5',
    employerContribution: employerContribution ?? '3',
    results: results ?? transformedData.results,
  };

  delete transformedData['language'];

  return transformedData;
};

export const queryStringFormat = (data: Record<string, string>) => {
  return Object.keys(data)
    .map((key) => {
      return `${key}=${encodeURIComponent(data && key ? data[key] : '')}`;
    })
    .join('&');
};
