import { z } from 'zod';

import { StepName } from '../lib/constants';
import { validateLanguage } from '../lib/utils';

/**
 * Validation schemas for each step in the booking form.
 * Each step contains:
 *  - a field that corresponds to the input name for that field (e.g. first-name)
 *  - an error message key to be used if validation fails. The error message key corresponds to the translation key in the locales files, allowing for dynamic error messages based on the field and step (e.g. 'first-name' -> with a look up in the UI t{${step}.form.error.first-name})
 */

export const validationSchemas: Record<string, z.ZodTypeAny> = {
  [StepName.APPOINTMENT_TYPE]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_DEFINED_CONTRIBUTION]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_OVER_50]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_UK_PENSIONS]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_AGE_EXCEPTIONS]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_PENSION_LOSS]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_BUSINESS_STATE]: z.object({
    businessState: z.string({ error: 'radio-button' }),
  }),
  [StepName.ACCESS_SUPPORT]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ACCESS_OPTIONS]: z.object({
    nextStep: z.string({ error: 'radio-button' }),
  }),
  [StepName.ACCESS_LANGUAGE]: z
    .object({
      accessLanguageType: z.string({ error: 'language-type' }),
      accessLanguageOther: z.string().optional(),
    })
    .superRefine((data, ctx) => validateLanguage(data, ctx)), // Custom validation function
};
