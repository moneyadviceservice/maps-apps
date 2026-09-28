import { NEXT_STEP_VALUE_DELIMITER } from '../constants';
import { EntryData } from '../types';

/**
 * This utility function processes raw form data from a submission, extracting field values and determining the next step for routing.
 *
 * The function is designed to handle linear, junction, and multi-select fields:
 * - Linear steps: String fields are stored as-is, and the next step is determined by a hidden input field named 'nextStep'. (see FormWrapper component)
 * - Junction steps: Certain string fields may contain a value in the format 'answer|nextStep', where the answer is stored and the next step is extracted for routing, overriding any default 'nextStep' value.
 * - Multi-select fields: Array values (for example checkbox groups) are stored as-is.
 *
 * The function iterates through each field in the submitted data and constructs a parsed data object
 * along with the determined next step for routing.
 *
 * @param requestData - The submitted FormData object containing field names and values.
 * @returns An object containing the parsed data for storage, the next step for routing, and the current step of the form.
 *
 * Example usage:
 * const formData = {
 *  name: 'John Doe',
 *  age: '30|age-next-step',
 *  preferredMethodOfCommunication: ['text-message', 'email'],
 *  nextStep: 'default-next-step'
 * };
 * const { parsedData, nextStep } = parseFormData(formData);
 *
 * Result in this example would be:
 *  parsedData: {
 *    name: 'John Doe',
 *    age: '30',
 *    preferredMethodOfCommunication: ['text-message', 'email']
 *  }
 *  nextStep: 'age-next-step' (overrides default-next-step in this case due to junction field)
 */
export function parseFormData(requestData: FormData): {
  parsedData: EntryData;
  nextStep: string;
  currentStep: string;
} {
  const dataObject = {} as EntryData;

  // Define a set of fields to exclude from the parsed data object, as they are handled separately for routing and state management.
  const excludedFields = new Set(['nextStep', 'currentStep']);

  const currentStep = requestData.get('currentStep')?.toString() ?? '';
  let nextStep = requestData.get('nextStep')?.toString() ?? '';

  // Iterate through each unique field name in the form data and store the value(s) in the data object, excluding 'nextStep' and 'currentStep'.
  // Use a single string for single-value fields and an array for multi-value fields (checkboxes).
  Array.from(new Set(requestData.keys()))
    .filter((fieldName) => !excludedFields.has(fieldName))
    .forEach((fieldName) => {
      const values = requestData
        .getAll(fieldName)
        .map((value) =>
          typeof value === 'string' ? value : JSON.stringify(value),
        );
      dataObject[fieldName] = values.length === 1 ? values[0] : values;
    });

  // Check each field in the data object for junction fields and, if found, split the value and update the data object and nextStep accordingly.
  Object.keys(dataObject).forEach((fieldName) => {
    const fieldValue = dataObject[fieldName];

    if (Array.isArray(fieldValue)) {
      // ARRAY fields (checkboxes)
      fieldValue.forEach((value: string, index: number) => {
        const selectedNextStep = processDelimitedValue(value, (cleanValue) => {
          fieldValue[index] = cleanValue;
        });
        if (selectedNextStep) nextStep = selectedNextStep;
      });
    } else {
      // STRING fields (linear/junction)
      const selectedNextStep = processDelimitedValue(
        fieldValue,
        (cleanValue) => {
          dataObject[fieldName] = cleanValue;
        },
      );
      if (selectedNextStep) nextStep = selectedNextStep;
    }
  });

  return { parsedData: dataObject, nextStep, currentStep };
}

const processDelimitedValue = (
  input: string,
  setValue: (value: string) => void,
): string | undefined => {
  if (!input.includes(NEXT_STEP_VALUE_DELIMITER)) {
    return undefined;
  }

  const [value, nextStep] = input.split(NEXT_STEP_VALUE_DELIMITER);
  setValue(value);
  return nextStep || undefined;
};
