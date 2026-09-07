import { EntryData } from '@maps-react/mhf/types';

import { NEXT_STEP_VALUE_DELIMITER } from '../constants';

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
 * @returns An object containing the parsed data for storage and the next step for routing.
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
} {
  const dataObject = {} as EntryData;

  // Extract the nextStep value from the form data, defaulting to an empty string if not present
  const postedNextStep = requestData.get('nextStep');
  let nextStep = typeof postedNextStep === 'string' ? postedNextStep : '';

  // Iterate through each unique field name in the form data (except nextStep) and store the value(s) in the data object. Use a single string for single-value fields and an array for multi-value fields (checkboxes).
  Array.from(new Set(requestData.keys()))
    .filter((fieldName) => fieldName !== 'nextStep')
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

  return { parsedData: dataObject, nextStep };
}

/**
 * Utility function to process a delimited value in the format 'value|nextStep'.
 * If the input contains the delimiter, it splits the value and updates the provided setValue callback with the cleaned value.
 * It returns the nextStep if present, or undefined if not.
 * @param input
 * @param setValue
 * @returns
 */
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
