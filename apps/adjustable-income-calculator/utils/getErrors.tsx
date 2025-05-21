import { ErrorObject } from '@maps-react/form/types';
import { PensionPotInputs } from '@maps-react/pension-tools/types';

/**
 *
 * @param errors  - The errors object from the form validation
 * @param values  - The values object from the form
 * @returns A list of error objects with the field name and error type
 */

export const getErrors = (
  errors: ErrorObject,
  values: Omit<PensionPotInputs, 'income, chunk, updateChunk, month'>,
) => {
  const { pot, age } = values;

  if (!pot && !age) {
    return errors;
  }

  delete errors['updateMonth'];

  if (errors?.age?.type === 'required') {
    delete errors['age'];
  }

  if (pot && Number(pot.replaceAll(',', '')) > 5000000) {
    errors.pot = {
      field: 'pot',
      type: 'max',
    };
  }

  if (age && Number(age) < 55) {
    errors.age = {
      field: 'age',
      type: 'min',
    };
  }

  return errors;
};
