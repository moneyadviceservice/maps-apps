import { z } from 'zod';

import { FORM_FIELD_CONTENT_KEY, FormFieldName, StepName } from '../constants';

/**
 * Validation schemas for each step in the booking form.
 * Each step contains:
 *  - a field that corresponds to the input name for that field (e.g. first-name)
 *  - an error message key to be used if validation fails. The error message key corresponds to the translation key in the locales files, allowing for dynamic error messages based on the field and step (e.g. 'first-name' -> with a look up in the UI / content file of taking-part.form.first-name.error})
 */

export const validationSchemas: Record<string, z.ZodTypeAny> = {
  [StepName.ABOUT_YOU]: z.object({
    [FormFieldName.FIRST_NAME]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.firstName })
      .max(50, { error: FORM_FIELD_CONTENT_KEY.firstName }),
    [FormFieldName.LAST_NAME]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.lastName })
      .max(50, { error: FORM_FIELD_CONTENT_KEY.lastName }),
    [FormFieldName.EMAIL_ADDRESS]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.emailAddress })
      .max(150, { error: FORM_FIELD_CONTENT_KEY.emailAddress })
      .pipe(z.email({ error: FORM_FIELD_CONTENT_KEY.emailAddress })),
    [FormFieldName.AGE_RANGE]: z.string({
      error: FORM_FIELD_CONTENT_KEY.ageRange,
    }),
  }),
  [StepName.WHERE_YOU_LIVE]: z.object({
    [FormFieldName.WHERE_YOU_LIVE]: z.string({
      error: FORM_FIELD_CONTENT_KEY.whereYouLive,
    }),
  }),
  [StepName.YOUR_SEX]: z
    .object({
      [FormFieldName.YOUR_SEX]: z.string({
        error: FORM_FIELD_CONTENT_KEY.yourSex,
      }),
      [FormFieldName.OTHER_SEX]: z.string().optional(),
    })
    .refine(
      (data) => {
        // Check if the "other" option is selected and validate accordingly
        if (data[FormFieldName.YOUR_SEX] === 'other') {
          // Return true if valid (has text), false if invalid (empty/undefined)
          return !!data[FormFieldName.OTHER_SEX]?.trim();
        }
        // If the radio is NOT 'other', validation automatically passes
        return true;
      },
      {
        error: FORM_FIELD_CONTENT_KEY.otherSex,
        // Attach the error to the text input field specifically
        path: [FormFieldName.OTHER_SEX],
      },
    ),
  [StepName.HEALTH_CONDITIONS]: z.object({
    [FormFieldName.HEALTH_CONDITIONS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.healthConditions,
    }),
  }),
  [StepName.HEALTH_CONDITIONS_IMPACT]: z.object({
    [FormFieldName.HEALTH_CONDITIONS_IMPACT]: z.string({
      error: FORM_FIELD_CONTENT_KEY.healthConditionsImpact,
    }),
  }),
};
