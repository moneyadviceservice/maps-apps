import { getErrors } from './getErrors';
describe('getErrors', () => {
  it('should return errors for invalid inputs', () => {
    const errors = {
      pot: { field: 'pot', type: 'required' },
      age: { field: 'age', type: 'required' },
    };
    const values = {
      pot: '',
      age: '',
    };
    const result = getErrors(errors, values);
    expect(result).toEqual(errors);
  });

  it('should return error if pot exceeded 5000000', () => {
    const errors = {
      pot: { field: 'pot', type: 'required' },
      age: { field: 'age', type: 'required' },
    };
    const values = {
      pot: '5000001',
      age: '60',
    };
    const result = getErrors(errors, values);

    expect(result).toEqual({
      pot: { field: 'pot', type: 'max' },
    });
  });

  it('should return error if age is yeanger than 55', () => {
    const errors = {
      pot: { field: 'pot', type: 'required' },
      age: { field: 'age', type: 'required' },
    };
    const values = {
      pot: '10000',
      age: '50',
    };
    const result = getErrors(errors, values);

    expect(result).toEqual({
      pot: { field: 'pot', type: 'required' },
      age: { field: 'age', type: 'min' },
    });
  });

  it('should remove updateMonth from error handling', () => {
    const errors = {
      pot: { field: 'pot', type: 'required' },
      age: { field: 'age', type: 'required' },
      updateMonth: { field: 'updateMonth', type: 'required' },
    };
    const values = {
      pot: '10000',
      age: '56',
    };
    const result = getErrors(errors, values);

    expect(result).toEqual({ pot: { field: 'pot', type: 'required' } });
  });

  it('should return an emtpy object if values are not required', () => {
    const values = {
      pot: '10000',
      age: '56',
    };
    const result = getErrors({}, values);

    expect(result).toEqual({});
  });
});
