import { getErrorRequiredOrInvalid } from './getErrorRequiredOrInvalid';

describe('getErrorRequiredOrInvalid', () => {
  it('should return an object with the required error when the value is empty', () => {
    const values = {
      value: '',
    };
    const result = getErrorRequiredOrInvalid(values);
    expect(result).toEqual({
      value: {
        field: 'value',
        type: 'required',
      },
    });
  });

  it('should return an object with the invalid error when the value is empty', () => {
    const values = {
      value: 'test',
    };
    const result = getErrorRequiredOrInvalid(values);
    expect(result).toEqual({
      value: {
        field: 'value',
        type: 'invalid',
      },
    });
  });
});
