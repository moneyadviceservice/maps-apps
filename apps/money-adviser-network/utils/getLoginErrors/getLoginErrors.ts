import { ErrorField } from '@maps-react/form/types';

import { FormFields } from '../../data/login';

export const getLoginErrors = (errors: ErrorField[], fields: FormFields) => {
  const errorMap: Record<string, string[]> = {};

  for (const e of errors) {
    const field = fields.find((f) => f.name === e.field);
    const err =
      (field?.errors && (field?.errors as Record<string, string>)[e.type]) ??
      null;

    if (field && err) {
      const existing = errorMap[e.field];

      errorMap[e.field] = existing ? [...existing, '\n', err] : [err];
    }
  }

  return errorMap;
};

export const getLoginAcdlErrors = (
  errors: ErrorField[],
  fields: FormFields,
) => {
  return errors.map((e) => {
    const field = fields.find((f) => f.name === e.field);

    const err =
      (field?.errors && (field?.errors as Record<string, string>)[e.type]) ||
      '';

    return {
      fieldType: e.field === 'password' ? 'Password field' : 'Text field',
      fieldName: field?.label ?? e.field,
      errorMessage: err,
    };
  });
};
