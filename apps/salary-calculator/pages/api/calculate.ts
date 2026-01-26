import { NextApiRequest, NextApiResponse } from 'next';

import {
  validateSalaryInput,
  SalaryFormInput,
  FieldError,
} from 'utils/validation';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

function appendErrors(
  errors: FieldError[],
  queryParams: URLSearchParams,
  prefix = '',
) {
  const errorsString = JSON.stringify(errors);
  const encodedErrors = encodeURIComponent(errorsString);
  queryParams.append(`${prefix}errors`, encodedErrors);
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

    // get the all salary2 inputs and construct a SalaryFormInput object for them
    for (const inputName of Object.keys(salaryInputs)) {
      salary2Inputs[inputName as keyof SalaryFormInput] =
        inputs[`salary2_${inputName}`];
    }

    const salary2Result = validateSalaryInput(salary2Inputs);
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
