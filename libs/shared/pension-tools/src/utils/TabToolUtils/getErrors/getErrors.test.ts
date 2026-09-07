import { useTranslation } from '@maps-react/hooks/useTranslation';

import { getErrors } from './getErrors';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: jest.fn((key) => key),
  }),
}));

describe('getErrors', () => {
  const z = useTranslation().z;

  const mockErrorMessages = {
    name: (z: ReturnType<typeof useTranslation>['z']) => ({
      required: {
        field: 'Name is required',
        page: 'Please provide your name',
        acdlMessage: 'Name required for ACDL',
      },
      condition: {
        field: 'Invalid name condition',
        page: 'Name condition not met',
        acdlMessage: 'Name condition error for ACDL',
      },
    }),
    age: (z: ReturnType<typeof useTranslation>['z']) => ({
      required: {
        field: 'Age is required',
        page: 'Please provide your age',
        acdlMessage: 'Age required for ACDL',
      },
      condition: {
        field: 'Invalid age condition',
        page: 'Age condition not met',
        acdlMessage: 'Age condition error for ACDL',
      },
    }),
  };

  it('should handle required errors correctly', () => {
    const errors = {
      name: 'required',
      age: 'required',
    };

    const result = getErrors(errors, z, mockErrorMessages);

    expect(result).toEqual({
      fieldErrors: {
        name: ['Name is required'],
        age: ['Age is required'],
      },
      pageErrors: {
        name: ['Please provide your name'],
        age: ['Please provide your age'],
      },
      acdlErrors: {
        name: ['Name required for ACDL'],
        age: ['Age required for ACDL'],
      },
    });
  });

  it('should handle condition errors correctly', () => {
    const errors = {
      name: 'condition',
    };

    const result = getErrors(errors, z, mockErrorMessages);

    expect(result).toEqual({
      fieldErrors: {
        name: ['Invalid name condition'],
      },
      pageErrors: {
        name: ['Name condition not met'],
      },
      acdlErrors: {
        name: ['Name condition error for ACDL'],
      },
    });
  });

  it('should handle no-message errors correctly', () => {
    const errors = {
      name: 'no-message',
    };

    const result = getErrors(errors, z, mockErrorMessages);

    expect(result).toEqual({
      fieldErrors: {
        name: [''],
      },
      pageErrors: {},
      acdlErrors: {},
    });
  });

  it('should handle missing error messages gracefully', () => {
    const errors = {
      unknownField: 'required',
    };

    const result = getErrors(errors, z, mockErrorMessages);

    expect(result).toEqual({
      fieldErrors: {
        unknownField: [''],
      },
      pageErrors: {
        unknownField: [''],
      },
      acdlErrors: {
        unknownField: [''],
      },
    });
  });
});
