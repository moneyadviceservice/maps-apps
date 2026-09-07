import { getLoginAcdlErrors, getLoginErrors } from './getLoginErrors';

const mockFields = [
  {
    name: 'username',
    label: 'User Name',
    errors: { required: 'Username is required' },
  },
  {
    name: 'password',
    label: 'Password',
    errors: { required: 'Password is required' },
  },
];

describe('getLoginErrors', () => {
  describe('login page and field errors', () => {
    it('should map errors correctly', () => {
      const errors = [
        { field: 'username', type: 'required' },
        { field: 'password', type: 'required' },
      ];

      const result = getLoginErrors(errors, mockFields);

      expect(result).toEqual({
        username: ['Username is required'],
        password: ['Password is required'],
      });
    });

    it('should return an empty object if no matching fields', () => {
      const errors = [{ field: 'email', type: 'required' }];

      const result = getLoginErrors(errors, mockFields);

      expect(result).toEqual({});
    });
  });

  describe('getLoginAcdlErrors', () => {
    it('should map errors for analytics correctly', () => {
      const errors = [
        { field: 'username', type: 'required' },
        { field: 'password', type: 'required' },
      ];

      const result = getLoginAcdlErrors(errors, mockFields);

      expect(result).toEqual([
        {
          fieldType: 'Text field',
          fieldName: 'User Name',
          errorMessage: 'Username is required',
        },
        {
          fieldType: 'Password field',
          fieldName: 'Password',
          errorMessage: 'Password is required',
        },
      ]);
    });

    it('should return default fieldName if label is missing', () => {
      const errors = [{ field: 'unknown', type: 'required' }];

      const result = getLoginAcdlErrors(errors, mockFields);

      expect(result).toEqual([
        {
          fieldType: 'Text field',
          fieldName: 'unknown',
          errorMessage: '',
        },
      ]);
    });
  });
});
