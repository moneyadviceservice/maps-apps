import { FormError } from '../types';
import { getFieldError } from './getFieldError';

describe('getFieldError', () => {
  const mockFormErrors: FormError[] = [
    { field: 'field-1', message: 'Field 1 is required' },
    { field: 'field-2', message: 'Field 2 is required' },
  ];

  it('should return the error message for a specific field', () => {
    const error = getFieldError(mockFormErrors, 'field-1');
    expect(error).toEqual([
      { field: 'field-1', message: 'Field 1 is required' },
    ]);
  });
  it('should return undefined if FormError is empty', () => {
    const error = getFieldError([], 'field-1');
    expect(error).toBeUndefined();
  });
});
