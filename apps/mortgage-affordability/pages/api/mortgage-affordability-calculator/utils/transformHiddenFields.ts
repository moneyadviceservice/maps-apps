import { FormData } from '@maps-react/pension-tools/types/forms';

export const transformHiddenFields = (
  formData: FormData,
  currentStep: string,
) => {
  const updatedFormData = { ...formData };
  if (currentStep === 'annual-income') {
    if (formData['q-second-applicant'] === 'no') {
      const fieldsToRemove = [
        'q-sec-app-annual-income',
        'q-sec-app-take-home',
        'q-sec-app-other-income',
      ];
      fieldsToRemove.forEach((field) => {
        delete updatedFormData[field];
      });
    }
  }

  return updatedFormData;
};
