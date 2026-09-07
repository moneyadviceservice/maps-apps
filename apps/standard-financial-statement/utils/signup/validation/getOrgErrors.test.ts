import { QuestionOrg } from 'data/form-data/org_signup';

import { getOrgErrors } from './getOrgErrors';

describe('getOrgErrors', () => {
  const inputs: QuestionOrg[] = [
    {
      name: 'orgName',
      title: 'Organisation Name',
      errors: {
        required: 'This field is required',
        invalid: 'Invalid format',
      },
      questionNbr: 1,
      group: '',
      type: '',
      answers: [],
    },
    {
      name: 'orgType',
      title: 'Organisation Type',
      errors: {
        required: 'Type is required',
      },
      questionNbr: 1,
      group: '',
      type: '',
      answers: [],
    },
    {
      name: 'otherField',
      title: 'Other Field',
      errors: {
        required: 'Other field required',
      },
      questionNbr: 1,
      group: '',
      type: '',
      answers: [],
    },
  ];

  it('maps a single error correctly', () => {
    const errors = [{ field: 'orgName', type: 'required' }];

    const result = getOrgErrors(inputs, errors);

    expect(result).toEqual({
      orgName: ['Organisation Name - This field is required'],
    });
  });

  it('maps multiple errors correctly', () => {
    const errors = [
      { field: 'orgName', type: 'required' },
      { field: 'orgType', type: 'required' },
    ];

    const result = getOrgErrors(inputs, errors);

    expect(result).toEqual({
      orgName: ['Organisation Name - This field is required'],
      orgType: ['Organisation Type - Type is required'],
    });
  });

  it('handles "Other" field naming', () => {
    const errors = [{ field: 'otherFieldOther', type: 'required' }];

    const result = getOrgErrors(inputs, errors);

    expect(result).toEqual({
      otherFieldOther: ['Other Field - Other field required'],
    });
  });

  it('ignores errors for unknown fields', () => {
    const errors = [{ field: 'unknownField', type: 'required' }];

    const result = getOrgErrors(inputs, errors);

    expect(result).toEqual({
      unknownField: ['undefined - undefined'],
    });
  });

  it('does not overwrite existing error for the same field', () => {
    const errors = [
      { field: 'orgName', type: 'required' },
      { field: 'orgName', type: 'invalid' },
    ];

    const result = getOrgErrors(inputs, errors);

    expect(result).toEqual({
      orgName: ['Organisation Name - This field is required'],
    });
  });
});
