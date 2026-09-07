import { z } from 'zod';

import {
  DateOfBirthData,
  validateDateOfBirth,
  validatePhoneNumber,
} from '@maps-react/mhf/form';

import { StepName } from '../lib/constants';
import { validateLanguage } from '../lib/form';

/**
 * Validation schemas for each step in the booking form.
 * Each step contains:
 *  - a field that corresponds to the input name for that field (e.g. first-name)
 *  - an error message key to be used if validation fails. The error message key corresponds to the translation key in the locales files, allowing for dynamic error messages based on the field and step (e.g. 'first-name' -> with a look up in the UI t{${step}.form.error.first-name})
 */

export const validationSchemas: Record<string, z.ZodTypeAny> = {
  [StepName.APPOINTMENT_TYPE]: z.object({
    flow: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_DEFINED_CONTRIBUTION]: z.object({
    eligibilityDefinedContributionStatus: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_OVER_50]: z.object({
    eligibilityOver50Status: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_UK_PENSIONS]: z.object({
    eligibilityUkPensionStatus: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_AGE_EXCEPTIONS]: z.object({
    eligibilityAgeExceptionType: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT]: z.object({
    eligibilityFinancialSettlementStatus: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_DIVORCE_JURISDICTION]: z.object({
    eligibilityDivorceJurisdictionStatus: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_PENSION_LOSS]: z.object({
    eligibilityPensionLossStatus: z.string({ error: 'radio-button' }),
  }),
  [StepName.ELIGIBILITY_BUSINESS_STATE]: z.object({
    businessState: z.string({ error: 'radio-button' }),
  }),
  [StepName.ACCESS_SUPPORT]: z.object({
    accessSupportStatus: z.string({ error: 'radio-button' }),
  }),
  [StepName.ACCESS_LANGUAGE]: z
    .object({
      accessLanguageType: z.string({ error: 'select' }),
      accessLanguageOther: z.string().optional(),
    })
    .superRefine((data, ctx) => validateLanguage(data, ctx)), // Custom validation function
  [StepName.ELIGIBILITY_PENSION_PROVIDER]: z.object({
    referredFrom: z
      .string()
      .trim()
      .min(1, { error: 'referred-from' })
      .max(50, { error: 'referred-from' }),
    transferringTo: z
      .string()
      .trim()
      .min(1, { error: 'transferring-to' })
      .max(50, { error: 'transferring-to' }),
  }),
  [StepName.APPOINTMENT_DATE_TIME]: z.object({
    appointmentSlotSelection: z.string({ error: 'radio-button' }),
  }),
  [StepName.CONTACT_DETAILS]: z.preprocess(
    (raw) => {
      if (!raw || typeof raw !== 'object') {
        return raw;
      }

      const data = raw as Record<string, unknown>;

      return {
        ...data,
        dateOfBirth: {
          day: data.day,
          month: data.month,
          year: data.year,
        },
      };
    },
    z.object({
      firstName: z
        .string()
        .trim()
        .min(1, { error: 'first-name' })
        .max(50, { error: 'first-name' }),
      lastName: z
        .string()
        .trim()
        .min(1, { error: 'last-name' })
        .max(50, { error: 'last-name' }),
      emailAddress: z
        .string()
        .trim()
        .pipe(z.email({ error: 'email-address' })),
      phoneNumber: z
        .string()
        .trim()
        .min(1, { error: 'phone-number' })
        .refine((value) => validatePhoneNumber(value).isValid, {
          error: 'phone-number',
        }),
      day: z.string().optional(),
      month: z.string().optional(),
      year: z.string().optional(),
      dateOfBirth: z.any().superRefine((value, ctx) =>
        validateDateOfBirth(
          {
            day: value?.day as DateOfBirthData['day'],
            month: value?.month as DateOfBirthData['month'],
            year: value?.year as DateOfBirthData['year'],
          },
          ctx,
        ),
      ),
      memorableWord: z
        .string()
        .trim()
        .min(1, { error: 'memorable-word' })
        .max(50, { error: 'memorable-word' }),
    }),
  ),
  [StepName.COMMUNICATION_PREFERENCES]: z.object({
    // Custom validation for preferredMethodOfCommunication to handle both string and array inputs
    preferredMethodOfCommunication: z.preprocess(
      (value) => {
        if (Array.isArray(value)) {
          return value;
        }

        if (typeof value === 'string' && value.length > 0) {
          return [value];
        }

        return [];
      },
      z.array(z.string()).min(1, {
        error: 'checkbox-preferred-method',
      }),
    ),
    largePrintCommunication: z.string({
      error: 'radio-button-large-print',
    }),
    contactYouCommunication: z.string({
      error: 'radio-button-contact-you',
    }),
  }),
  [StepName.ADDRESS_DETAILS]: z.object({
    addressLine1: z
      .string()
      .trim()
      .min(1, { error: 'address-line-1' })
      .max(100, { error: 'address-line-1' }),
    city: z
      .string()
      .trim()
      .min(1, { error: 'city' })
      .max(50, { error: 'city' }),
    postcode: z
      .string()
      .trim()
      .min(1, { error: 'postcode' })
      .max(10, { error: 'postcode' }),
    country: z
      .string()
      .trim()
      .min(1, { error: 'country' })
      .max(50, { error: 'country' }),
  }),
  [StepName.FIND_APPOINTMENT]: z.preprocess(
    (raw) => {
      if (!raw || typeof raw !== 'object') {
        return raw;
      }

      const data = raw as Record<string, unknown>;

      return {
        ...data,
        dateOfBirth: {
          day: data.day,
          month: data.month,
          year: data.year,
        },
      };
    },
    z.object({
      referenceNumber: z
        .string()
        .trim()
        .min(1, { error: 'reference-number' })
        .max(50, { error: 'reference-number' }),
      day: z.string().optional(),
      month: z.string().optional(),
      year: z.string().optional(),
      dateOfBirth: z.any().superRefine((value, ctx) =>
        validateDateOfBirth(
          {
            day: value?.day as DateOfBirthData['day'],
            month: value?.month as DateOfBirthData['month'],
            year: value?.year as DateOfBirthData['year'],
          },
          ctx,
        ),
      ),
    }),
  ),
  [StepName.APPOINTMENT_FOUND]: z.object({
    appointmentAction: z.string({ error: 'radio-button' }),
  }),
};
