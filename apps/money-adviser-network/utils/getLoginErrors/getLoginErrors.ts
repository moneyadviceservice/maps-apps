import { ErrorField } from '@maps-react/form/types';

import { SignInFields } from '../../data/sign-in/sign-in';

export const getLoginErrors = (
  errors: ErrorField[],
  fields: SignInFields[],
) => {
  const errorMap: Record<string, string[]> = {};

  errors.forEach((e) => {
    const field = fields.find((f) => f.name === e.field);
    const err =
      (field?.errors && (field?.errors as Record<string, string>)[e.type]) ||
      null;

    if (field && err) {
      if (errorMap[e.field]) {
        errorMap[e.field].push('\n');
        errorMap[e.field].push(err);
      } else {
        errorMap[e.field] = [err];
      }
    }
  });

  return errorMap;
};

export const getLoginAcdlErrors = (
  errors: ErrorField[],
  fields: SignInFields[],
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
