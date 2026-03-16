import {
  FormData,
  FormValidationObj,
} from '@maps-react/pension-tools/types/forms';

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateForm = (
  tab: string,
  formData: FormData,
  validationRules: FormValidationObj[],
): ValidationResult => {
  const errors: { [key: string]: string } = {};
  const validateTab = () => {
    const rules = validationRules[Number(tab) - 1];

    if (rules) {
      Object.keys(rules).forEach((rule) => {
        let fields = [formData[`q-${rule}`]];
        const isRequired = rules[rule]?.required;
        const fieldType = rules[rule]?.type;
        if (fieldType === 'input-currency-with-select') {
          fields = [formData[`q-${rule}-i`], formData[`q-${rule}-s`]];
        }

        fields.forEach((field) => {
          if (isRequired && !field) {
            errors[rule] = rules[rule]?.requiredPageMessage ?? 'Required field';
          }
        });
      });
    }
  };

  validateTab();

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
