import { mockErrors } from '../mocks';
import { getFieldError } from './getFieldError';

describe('getFieldError', () => {
  it('should return the error message for a specific field', () => {
    const error = getFieldError('field-1', mockErrors);
    expect(error).toEqual('Field 1 is required');
  });
  it('should return undefined if there are no errors for the field', () => {
    const error = getFieldError('field-3', mockErrors);
    expect(error).toBeUndefined();
  });

  it('should return undefined if errors object is not provided', () => {
    const error = getFieldError('field-1');
    expect(error).toBeUndefined();
  });

  it('should return undefined if the errors array for the field is empty', () => {
    const error = getFieldError('field-1', { 'field-1': [] });
    expect(error).toBeUndefined();
  });
});
