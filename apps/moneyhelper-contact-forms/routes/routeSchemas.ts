import { z } from 'zod';

import {
  DateOfBirthData,
  validateDateOfBirth,
  validatePhoneNumber,
  validatePhoneNumberRequirement,
  validatePostCode,
} from '../form';
import { StepName } from '../lib/constants';

// See https://zod.dev/
export const validationSchemas = {
  [StepName.ENQUIRY_TYPE]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.INSURANCE_TYPE]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.PENSION_TYPE]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.APPOINTMENT_TYPE]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.NAME]: z.object({
    'first-name': z
      .string()
      .min(1, { error: 'first-name' })
      .max(50, { error: 'first-name' }),
    'last-name': z
      .string()
      .min(1, { error: 'last-name' })
      .max(50, { error: 'last-name' }),
  }),
  [StepName.DATE_OF_BIRTH]: z
    .object({
      day: z.any(),
      month: z.any(),
      year: z.any(),
    })
    .superRefine((data, ctx) =>
      validateDateOfBirth(data as DateOfBirthData, ctx),
    ), // Custom validation function
  [StepName.CONTACT_DETAILS]: z
    .object({
      email: z.email('email'),
      'phone-number': z
        .string()
        .optional()
        .refine((value) => validatePhoneNumber(value).isValid, {
          error: 'phone-number',
        }),
      // Custom validation function
      'post-code': z
        .string()
        .optional()
        .refine((value) => validatePostCode(value).isValid, {
          error: 'post-code',
        }),
      // Required fields for EntryData compatibility
      flow: z.string(),
      lang: z.string(),
    })
    .refine(validatePhoneNumberRequirement, {
      error: 'phone-number',
      path: ['phone-number'],
    }),
  [StepName.ENQUIRY]: z.object({
    'text-area': z
      .string()
      .min(50, { error: 'text-area' })
      .max(4000, { error: 'text-area' }),
    'booking-reference': z
      .string()
      .max(50, { error: 'booking-reference' })
      .optional(),
  }),
};
