import { z } from 'zod';

import {
  DateOfBirthData,
  isPhoneNumberRequired,
  validateDateOfBirth,
  validatePhoneNumber,
  validatePostCode,
} from '../form';
import { StepName } from '../lib/constants';

// See https://zod.dev/
export const validationSchemas = {
  [StepName.ENQUIRY_TYPE]: z.object({
    flow: z.string({ message: 'flow' }),
  }),
  [StepName.INSURANCE_TYPE]: z.object({
    flow: z.string({ message: 'flow' }),
  }),
  [StepName.PENSION_TYPE]: z.object({
    flow: z.string({ message: 'flow' }),
  }),
  [StepName.APPOINTMENT_TYPE]: z.object({
    flow: z.string({ message: 'flow' }),
  }),
  [StepName.NAME]: z.object({
    'first-name': z.string().min(1, 'first-name').max(50, 'first-name'),
    'last-name': z.string().min(1, 'last-name').max(50, 'last-name'),
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
      email: z.string().email('email'),
      'phone-number': z
        .string()
        .optional()
        .refine((value) => validatePhoneNumber(value).isValid, 'phone-number'),
      // Custom validation function
      'post-code': z
        .string()
        .optional()
        .refine((value) => validatePostCode(value).isValid, 'post-code'),
      // Custom validation function
    })
    .passthrough() // allows extra fields like flow (which is used in isPhoneNumberRequired)
    .refine(isPhoneNumberRequired, {
      message: 'phone-number',
      path: ['phone-number'],
    }),
  [StepName.ENQUIRY]: z.object({
    'text-area': z.string().min(50, 'text-area').max(4000, 'text-area'),
    'booking-reference': z.string().max(50, 'booking-reference').optional(),
  }),
};
