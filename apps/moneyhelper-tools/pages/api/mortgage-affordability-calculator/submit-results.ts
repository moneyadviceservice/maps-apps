import type { NextApiRequest, NextApiResponse } from 'next';

import { resultPrefix } from 'data/mortgage-affordability/results';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import {
  combineSavedAndFormData,
  removeZeroValuesAndTransform,
} from '../utils';
import { validateResults } from './utils/validateResults';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    language,
    isEmbed,
    toolBaseUrl,
    savedData,
    savedResultData,
    nextStep,
    currentStep,
    action,
    validation,
    ...formData
  } = req.body;
  const isEmbedBool = isEmbed === 'true';

  const formDataObject: Record<string, string> = Object.keys(formData)
    .filter((key) => key.startsWith(resultPrefix))
    .reduce((acc, key) => {
      acc[key] = formData[key];
      return acc;
    }, {} as Record<string, string>);

  const transformedData = removeZeroValuesAndTransform(
    combineSavedAndFormData(savedData, formDataObject, savedResultData),
  );

  let refererWithoutQuery = '';
  if (req.headers.referer) {
    const url = new URL(req.headers.referer);
    refererWithoutQuery = `${url.origin}${url.pathname}`;
  }

  let nextPage = nextStep;

  if (action === 'recalculate' || action === 'recalculate-living') {
    nextPage = currentStep;
  }

  const parsedValidation = validation ? JSON.parse(validation) : {};

  const validationResult =
    action === 'recalculate-living'
      ? { isValid: true, errors: [] }
      : validateResults(formData, language, parsedValidation);

  if (!validationResult.isValid) {
    const errorsString = JSON.stringify(validationResult.errors);
    const encodedErrors = encodeURIComponent(errorsString);
    const queryParams = new URLSearchParams(transformedData);
    queryParams.append('errors', encodedErrors);

    res.redirect(
      303,
      `${refererWithoutQuery}?${queryParams.toString()}${addEmbedQuery(
        isEmbedBool,
        '&',
      )}`,
    );
  } else {
    const query = new URLSearchParams(transformedData).toString();
    res.redirect(
      303,
      `${toolBaseUrl}${nextPage}?${query}${addEmbedQuery(isEmbedBool, '&')}`,
    );
  }
}
