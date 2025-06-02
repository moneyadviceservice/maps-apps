import { Entry, EntryData, FormError } from '../lib/types';
import { validationSchemas } from '../routes/routeSchemas';

/**
 * Validates the form submission data against the schema for the current step.
 * @param entry - The current store entry object.
 * @param dataObject - The form data object containing the submitted values.
 * @param steps - Array of step names in the flow.
 * @returns
 */
export function validateFormSubmission(
  entry: Entry,
  dataObject: EntryData,
  steps: string[],
): FormError[] | undefined {
  const { stepIndex } = entry;

  // Get the current step name from the flow and check if validation is needed
  const currentStepName = steps[stepIndex];
  const validationSchema =
    validationSchemas[currentStepName as keyof typeof validationSchemas];

  if (!validationSchema) {
    console.warn(
      `No validation schema found for step: ${currentStepName}. Skipping validation.`,
    );
    return undefined; // No validation required, return undefined
  }

  // Validate the form data using the schema and return errors if any
  const parsedData = validationSchema.safeParse(dataObject);
  if (!parsedData.success) {
    return parsedData.error.errors.map((err) => ({
      field: err.path[0] as string, // The field name (e.g., "firstName")
      message: err.message, // The error message (e.g., "First name is required")
    }));
  }

  // Validation succeeded - no errors returned
  return undefined;
}
