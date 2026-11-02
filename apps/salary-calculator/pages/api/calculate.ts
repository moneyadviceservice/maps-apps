import { NextApiRequest, NextApiResponse } from 'next';

import {
  FieldError,
  SalaryFormInput,
  validateSalaryInput,
} from 'utils/validation';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

function appendErrors(
  errors: FieldError[],
  queryParams: URLSearchParams,
  prefix = '',
) {
  const prefixedErrors = errors.map((error) =>
    prefix ? { ...error, field: `${prefix}${error.field}` } : error,
  );

  queryParams.append(`${prefix}errors`, JSON.stringify(prefixedErrors));
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { language, isEmbed, ...inputs } = request.body;
  const salaryInputs = inputs as SalaryFormInput;
  const salaryResult = validateSalaryInput(salaryInputs);

  let hasErrors = false;

  const queryParams = new URLSearchParams();

  if (request.body) {
    Object.entries(request.body).forEach(([key, value]) => {
      queryParams.set(key, value as string);
    });
  }

  if (salaryInputs.calculationType === 'joint') {
    const salary2Inputs: SalaryFormInput = { grossIncome: '' };

    // Only copy fields from request body that actually belong to salary2
    Object.keys(inputs).forEach((key) => {
      if (key.startsWith('salary2_')) {
        const field = key.replace('salary2_', '') as keyof SalaryFormInput;
        salary2Inputs[field] = inputs[key];
      }
    });

    // Validate salary2
    const salary2Result = validateSalaryInput(salary2Inputs);

    // Append any salary2 errors with prefix
    if (salary2Result.errors) {
      appendErrors(salary2Result.errors, queryParams, 'salary2_');
      hasErrors = true;
    }
  }

  if (salaryResult.errors) {
    appendErrors(salaryResult.errors, queryParams);

    hasErrors = true;
  }

  response.redirect(
    302,
    `/${language ?? 'en'}?${queryParams.toString()}${addEmbedQuery(
      isEmbed === 'true',
      '&',
    )}${hasErrors ? '#error-summary-heading' : ''}`,
  );
}
