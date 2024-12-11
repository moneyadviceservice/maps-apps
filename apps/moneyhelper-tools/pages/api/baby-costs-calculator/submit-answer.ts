import type { NextApiRequest, NextApiResponse } from 'next';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import {
  combineSavedAndFormData,
  removeZeroValuesAndTransform,
} from '../utils';
import { validateForm } from './utils/validateForm';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    tab,
    language,
    isEmbed,
    toolBaseUrl,
    savedData,
    validation,
    lastTab,
    action,
    userTab,
    ...formData
  } = req.body;
  const isEmbedBool = isEmbed === 'true';
  const transformedData = removeZeroValuesAndTransform(
    combineSavedAndFormData(savedData, formData),
  );

  const getNextTab = () => {
    if (action === 'refreshScreen') {
      return tab;
    } else if (action === 'save') {
      return 'save';
    } else {
      return userTab || lastTab || parseInt(tab, 10) + 1;
    }
  };

  const nextTab = getNextTab();

  const parsedValidationRules = validation ? JSON.parse(validation) : {};
  const validationResult = validateForm(tab, formData, parsedValidationRules);

  if (!validationResult.isValid) {
    const errorQuery = new URLSearchParams({
      ...transformedData,
      ...(action === 'save' && { tab: tab }),
      errors: JSON.stringify(validationResult.errors),
    }).toString();
    res.redirect(
      303,
      `${toolBaseUrl}${tab}?${errorQuery}${addEmbedQuery(isEmbedBool, '&')}`,
    );
  } else {
    const query = new URLSearchParams({
      ...transformedData,
      ...(action === 'save' && { tab: tab }),
    }).toString();
    res.redirect(
      303,
      `${toolBaseUrl}${nextTab}?${query}${addEmbedQuery(isEmbedBool, '&')}`,
    );
  }
}
