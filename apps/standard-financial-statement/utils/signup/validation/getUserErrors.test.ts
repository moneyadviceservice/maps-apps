import { QuestionOrg } from 'data/form-data/org_signup';
import { ZodError } from 'zod';

import { getUserErrors } from './getUserErrors';

describe('getUserErrors', () => {
  const inputs: QuestionOrg[] = [
    {
      name: 'emailAddress',
      title: 'Email',
      errors: {
        not_allowed: 'Email not allowed',
        user_already_exists: 'User already exists',
        invalid: 'Invalid email',
      },
      questionNbr: 3,
      group: 'new',
      type: 'new',
      answers: [],
    },
    {
      name: 'password',
      title: 'Password',
      errors: {
        too_small: 'Password too short',
        required: 'Password is required',
      },
      questionNbr: 4,
      group: 'new',
      type: 'new',
      answers: [],
    },
  ];

  it('maps standard Zod errors to user-friendly messages', () => {
    const issues = [
      {
        path: ['password'],
        code: 'too_small',
        message: '',
        minimum: 0,
        origin: '',
      },
    ];

    const zodError = { issues } as ZodError;

    const result = getUserErrors(inputs, zodError);

    expect(result).toEqual({
      password: ['Password - Password too short'],
    });
  });

  it('maps email issues with "not_allowed" correctly', () => {
    const issues = [
      {
        path: ['emailAddress'],
        code: 'custom',
        message: 'not_allowed',
      },
    ];

    const zodError = { issues } as ZodError;

    const result = getUserErrors(inputs, zodError);

    expect(result).toEqual({
      emailAddress: ['Email - Email not allowed'],
    });
  });

  it('maps email issues with "user_already_exists" correctly', () => {
    const issues = [
      {
        path: ['emailAddress'],
        code: 'custom',
        message: 'user_already_exists',
      },
    ];

    const zodError = { issues } as ZodError;

    const result = getUserErrors(inputs, zodError);

    expect(result).toEqual({
      emailAddress: ['Email - User already exists'],
    });
  });

  it('does not overwrite existing error for the same field', () => {
    const issues = [
      {
        path: ['password'],
        code: 'too_small',
        message: '',
        minimum: 0,
        origin: '',
      },
      { path: ['password'], code: 'invalid_value', message: '', values: [] },
    ];

    const zodError = { issues } as ZodError;

    const result = getUserErrors(inputs, zodError);

    expect(result).toEqual({
      password: ['Password - Password too short'],
    });
  });

  it('returns undefined message if field not found in inputs', () => {
    const issues = [
      {
        path: ['unknownField'],
        code: 'too_small',
        message: '',
        minimum: 0,
        origin: '',
      },
    ];

    const zodError = { issues } as ZodError;

    const result = getUserErrors(inputs, zodError);

    expect(result).toEqual({
      unknownField: ['undefined - undefined'],
    });
  });
});
