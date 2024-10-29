import type { NextApiRequest, NextApiResponse } from 'next';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { validateForm } from './utils/validateForm';
import { transformHiddenFields } from './utils/transformHiddenFields';
import { transformedValidation } from './utils/transformValidation';
import { calculateBudget } from './utils/calculateBudget';
import {
  combineSavedAndFormData,
  removeZeroValuesAndTransform,
} from '../utils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    currentStepIndex,
    language,
    isEmbed,
    toolBaseUrl,
    savedData,
    validation,
    nextStep,
    currentStep,
    ...formData
  } = req.body;
  const isEmbedBool = isEmbed === 'true';

  const transformedData = removeZeroValuesAndTransform(
    transformHiddenFields(
      combineSavedAndFormData(savedData, formData),
      currentStep,
    ),
  );

  let refererWithoutQuery = '';
  if (req.headers.referer) {
    const url = new URL(req.headers.referer);
    refererWithoutQuery = `${url.origin}${url.pathname}`;
  }
  let nextPage = nextStep;

  const parsedValidationRules = validation ? JSON.parse(validation) : {};
  const transformedValidationObject = transformedValidation(
    currentStep,
    currentStepIndex,
    formData,
    parsedValidationRules,
  );

  const validationResult = validateForm(
    removeZeroValuesAndTransform(formData),
    transformedValidationObject,
  );

  if (currentStep === 'household-costs') {
    const incomeExpenseValidation = calculateBudget(transformedData);

    if (!incomeExpenseValidation) {
      nextPage = 'notice';
    }
  }

  const queryParams = new URLSearchParams(transformedData);
  const hasNonJsFieldsToDisplay =
    validationResult.userNotSeen &&
    Object.keys(validationResult.userNotSeen).length > 0;

  if (!validationResult.isValid || hasNonJsFieldsToDisplay) {
    if (Object.keys(validationResult.errors).length > 0) {
      const errorsString = JSON.stringify(validationResult.errors);
      const encodedErrors = encodeURIComponent(errorsString);
      queryParams.append('errors', encodedErrors);
    }

    let pageAnchor = 'error-summary-heading';
    if (hasNonJsFieldsToDisplay) {
      const firstUnseenField = `q-${
        Object.keys(validationResult.userNotSeen)[0]
      }`;
      pageAnchor = firstUnseenField;
    }

    res.redirect(
      303,
      `${refererWithoutQuery}?${queryParams.toString()}${addEmbedQuery(
        isEmbedBool,
        '&',
      )}#${pageAnchor}`,
    );
  } else {
    res.redirect(
      303,
      `${toolBaseUrl}${nextPage}?${queryParams.toString()}${addEmbedQuery(
        isEmbedBool,
        '&',
      )}`,
    );
  }
}
