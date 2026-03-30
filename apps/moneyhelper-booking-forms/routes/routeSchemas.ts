import { z } from 'zod';

import { StepName } from '../lib/constants';

// See https://zod.dev/
export const validationSchemas: Record<string, z.ZodTypeAny> = {
  [StepName.APPOINTMENT_TYPE]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_DEFINED_CONTRIBUTION]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_OVER_50]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_UK_PENSIONS]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_AGE_EXCEPTIONS]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_BUSINESS_STATE]: z.object({
    businessState: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_PENSION_LOSS]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
};
