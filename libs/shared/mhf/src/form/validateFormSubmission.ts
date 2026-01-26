import z from 'zod';

import { Entry, EntryData } from '../types';

/**
 * Validates the form submission data against the schema for the current step.
 * @param entry - The current store entry object.
 * @param dataObject - The form data object containing the submitted values.
 * @param validationSchemas - Object containing validation schemas for each step.
 * @returns
 */
export function validateFormSubmission(
  entry: Entry,
  dataObject: EntryData,
  validationSchemas: Record<string, z.ZodTypeAny>,
): Record<string, (string | undefined)[]> | undefined {
  const { stepIndex, steps } = entry;
  // Get the current step name from the flow and check if validation is needed
  const currentStepName = steps[stepIndex];
  const validationSchema = validationSchemas[currentStepName];

  if (!validationSchema) {
    console.warn(
      `No validation schema found for step: ${currentStepName}. Skipping validation.`,
    );
    return undefined; // No validation required - no errors returned
  }
  // Validate the form data using the schema and return errors if any
  const parsedData = validationSchema.safeParse(dataObject);
  if (!parsedData.success) {
    // Aggregate errors into a single object
    const errors: Record<string, (string | undefined)[]> = {};
    for (const err of parsedData.error.issues) {
      const key = err.path[0] as string;
      errors[key] = errors[key] || [];
      errors[key].push(err.message);
    }
    return errors;
  }

  // Validation succeeded - no errors returned
  return undefined;
}
