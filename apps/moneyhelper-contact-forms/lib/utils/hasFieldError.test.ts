import { ErrorType } from '@maps-react/common/components/Errors';

import { FormError } from '../types';
import { hasFieldError } from './hasFieldError';

const mockFormErrors: FormError[] = [
  { field: 'field-1', message: 'Field 1 is required' },
  { field: 'field-2', message: 'Field 2 is required' },
];
describe('hasFieldError', () => {
  it('should return an array with an ErrorType object if the field has an error', () => {
    const result = hasFieldError(mockFormErrors, 'field-1');
    expect(result).toEqual([{} as ErrorType]);
  });
  it('should return an empty array if the field does not have an error', () => {
    const result = hasFieldError(mockFormErrors, 'email');
    expect(result).toEqual([]);
  });
});
