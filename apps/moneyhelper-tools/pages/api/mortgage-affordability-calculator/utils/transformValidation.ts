import { IncomeFieldKeys } from 'data/mortgage-affordability/step';
import { FormData, FormValidationObj } from 'data/types';

export const transformedValidation = (
  currentStep: string,
  currentStepIndex: string,
  formData: FormData,
  validationRules: FormValidationObj[],
) => {
  const transformedValidationObject = {
    ...validationRules[Number(currentStepIndex)],
  };
  if (currentStep === 'annual-income') {
    const fieldsToValidate = [
      IncomeFieldKeys.SEC_ANNUAL_INCOME,
      IncomeFieldKeys.SEC_TAKE_HOME,
      IncomeFieldKeys.SEC_OTHER_INCOME,
    ];

    if (formData['q-second-applicant'] === 'no') {
      fieldsToValidate.forEach((field) => {
        delete transformedValidationObject[field];
      });
    } else if (
      formData['q-second-applicant'] === 'yes' &&
      !Object.hasOwn(formData, `q-${IncomeFieldKeys.SEC_TAKE_HOME}`)
    ) {
      // these fields do not come through on first 'yes' submit from js disabled form
      // so we have to reload the screen so they can populate them.
      fieldsToValidate.forEach((field) => {
        transformedValidationObject[field] = {
          userNotSeen: true,
          ...transformedValidationObject[field],
        };
      });
    }
  }

  return transformedValidationObject;
};
