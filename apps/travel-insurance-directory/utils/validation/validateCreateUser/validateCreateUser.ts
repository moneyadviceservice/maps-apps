import { ApiFormValidationState, FieldResult, FieldType } from 'types/register';

import { validateIRN } from '../validateIRN';

interface ValidationInput {
  [key: string]: {
    value: string;
    type: FieldType;
  };
}

export async function validateCreateUser(
  payload: ValidationInput,
  fcaNumber?: string,
): Promise<ApiFormValidationState> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;

  const results: Record<string, FieldResult> = {};

  for (const [key, field] of Object.entries(payload)) {
    const { value, type } = field;

    const isEmpty =
      value === undefined || value === null || value.toString().trim() === '';

    if (isEmpty || (type === 'checkbox' && !value)) {
      results[key] = { error: 'required' };
      continue;
    }

    if (type === 'email' && !emailRegex.test(value)) {
      results[key] = { error: 'invalid' };
    } else if (type === 'phone' && !phoneRegex.test(value)) {
      results[key] = { error: 'invalid' };
    } else if (key === 'individualReferenceNumber') {
      const isIrnValid = await validateIRN(value, fcaNumber);

      if (isIrnValid) {
        results[key] = { ok: true };
      } else {
        results[key] = { error: 'invalid' };
      }
    } else {
      results[key] = { ok: true };
    }
  }

  const ok = Object.values(results).every((res) => 'ok' in res);

  return {
    ok,
    fields: results,
    error: !ok,
  };
}
