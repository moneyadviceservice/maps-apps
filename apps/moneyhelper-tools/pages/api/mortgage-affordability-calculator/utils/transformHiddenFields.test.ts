import { FormData } from 'data/types';

import { transformHiddenFields } from './transformHiddenFields';

describe('transformHiddenFields', () => {
  const formDataNo: FormData = {
    'q-second-applicant': 'no',
    'q-sec-app-annual-income': '50000',
    'q-sec-app-take-home': '40000',
    'q-sec-app-other-income': '10000',
  };

  const formDataYes: FormData = {
    ...formDataNo,
    'q-second-applicant': 'yes',
  };

  const annualIncomeStep = 'annual-income';

  it('should remove secondary applicant fields if "q-second-applicant" is "no" on "annual-income" step', () => {
    const result = transformHiddenFields(formDataNo, annualIncomeStep);

    expect(result).toEqual({
      'q-second-applicant': 'no',
    });
  });

  it('should not remove secondary applicant fields if "q-second-applicant" is not "no" on "annual-income" step', () => {
    const result = transformHiddenFields(formDataYes, annualIncomeStep);

    expect(result).toEqual(formDataYes);
  });

  it('should not remove any fields if currentStep is not "annual-income"', () => {
    const result = transformHiddenFields(formDataNo, 'some-other-step');

    expect(result).toEqual(formDataNo);
  });
});
