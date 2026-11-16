import { FieldResult } from 'types/register';

import { errorFormat } from './errorFormat';

describe('errorFormat', () => {
  it('should return a validation state with error set to true and ok set to false', () => {
    const mockFields: Record<string, FieldResult> = {
      email: {
        error: 'invalid',
      },
      password: {
        error: 'invalid',
      },
    };

    const result = errorFormat(mockFields);

    expect(result).toEqual({
      ok: false,
      fields: mockFields,
      error: true,
    });
  });

  it('should handle an empty fields object', () => {
    const emptyFields: Record<string, FieldResult> = {};

    const result = errorFormat(emptyFields);

    expect(result.fields).toEqual({});
    expect(result.error).toBe(true);
    expect(result.ok).toBe(false);
  });
});
