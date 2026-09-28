import { z } from 'zod';

import {
  DateOfBirthData,
  validateDateOfBirth,
  validatePhoneNumber,
} from '@maps-react/mhf/form';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../lib/constants';
import { validateAccessOptions, validateLanguage } from '../lib/form';

/**
 * Validation schemas for each step in the booking form.
 * Each step contains:
 *  - a field that corresponds to the input name for that field (e.g. first-name)
 *  - an error message key to be used if validation fails. The error message key corresponds to the translation key in the locales files, allowing for dynamic error messages based on the field and step (e.g. 'first-name' -> with a look up in the UI t{${step}.form.error.${FORM_FIELD_CONTENT_KEY.FIRST_NAME}})
 */

export const validationSchemas: Record<string, z.ZodTypeAny> = {
  [StepName.APPOINTMENT_TYPE]: z.object({
    flow: z.string({ error: 'flow' }),
  }),
  [StepName.ELIGIBILITY_DEFINED_CONTRIBUTION]: z.object({
    [FormFieldName.ELIGIBILITY_DEFINED_CONTRIBUTION_STATUS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityDefinedContributionStatus,
    }),
  }),
  [StepName.ELIGIBILITY_OVER_50]: z.object({
    [FormFieldName.ELIGIBILITY_OVER_50_STATUS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityOver50Status,
    }),
  }),
  [StepName.ELIGIBILITY_UK_PENSIONS]: z.object({
    [FormFieldName.ELIGIBILITY_UK_PENSION_STATUS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityUkPensionStatus,
    }),
  }),
  [StepName.ELIGIBILITY_AGE_EXCEPTIONS]: z.object({
    [FormFieldName.ELIGIBILITY_AGE_EXCEPTION_TYPE]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityAgeExceptionType,
    }),
  }),
  [StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT]: z.object({
    [FormFieldName.ELIGIBILITY_FINANCIAL_SETTLEMENT_STATUS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityFinancialSettlementStatus,
    }),
  }),
  [StepName.ELIGIBILITY_DIVORCE_JURISDICTION]: z.object({
    [FormFieldName.ELIGIBILITY_DIVORCE_JURISDICTION_STATUS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityDivorceJurisdictionStatus,
    }),
  }),
  [StepName.ELIGIBILITY_PENSION_LOSS]: z.object({
    [FormFieldName.ELIGIBILITY_PENSION_LOSS_STATUS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityPensionLossStatus,
    }),
  }),
  [StepName.ELIGIBILITY_BUSINESS_STATE]: z.object({
    [FormFieldName.ELIGIBILITY_BUSINESS_STATE]: z.string({
      error: FORM_FIELD_CONTENT_KEY.eligibilityBusinessState,
    }),
  }),
  [StepName.ACCESS_SUPPORT]: z.object({
    [FormFieldName.ACCESS_SUPPORT_STATUS]: z.string({
      error: FORM_FIELD_CONTENT_KEY.accessSupportStatus,
    }),
  }),
  [StepName.ACCESS_OPTIONS]: z
    .object({
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: z.string({
        error: FORM_FIELD_CONTENT_KEY.accessSupportRequest,
      }),
      [FormFieldName.ACCESS_SUPPORT_COMPANION]: z.string().optional(),
      [FormFieldName.ACCESS_SUPPORT_DETAILS]: z.string().optional(),
    })
    .superRefine((data, ctx) => validateAccessOptions(data, ctx)),
  [StepName.ACCESS_LANGUAGE]: z
    .object({
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: z.string({
        error: FORM_FIELD_CONTENT_KEY.accessSupportLanguageType,
      }),
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]: z.string().optional(),
    })
    .superRefine((data, ctx) => validateLanguage(data, ctx)), // Custom validation function
  [StepName.ELIGIBILITY_PENSION_PROVIDER]: z.object({
    [FormFieldName.ELIGIBILITY_REFERRED_FROM]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.eligibilityReferredFrom })
      .max(50, { error: FORM_FIELD_CONTENT_KEY.eligibilityReferredFrom }),
    [FormFieldName.ELIGIBILITY_TRANSFERRING_TO]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.eligibilityTransferringTo })
      .max(50, { error: FORM_FIELD_CONTENT_KEY.eligibilityTransferringTo }),
  }),
  [StepName.APPOINTMENT_DATE_TIME]: z.object({
    [FormFieldName.APPOINTMENT_SLOT_SELECTION]: z.string({
      error: FORM_FIELD_CONTENT_KEY.appointmentSlotSelection,
    }),
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
        .pipe(z.email({ error: FORM_FIELD_CONTENT_KEY.emailAddress })),
      [FormFieldName.PHONE_NUMBER]: z
        .string()
        .trim()
        .min(1, { error: FORM_FIELD_CONTENT_KEY.phoneNumber })
        .refine((value) => validatePhoneNumber(value).isValid, {
          error: FORM_FIELD_CONTENT_KEY.phoneNumber,
        }),
      day: z.string().optional(),
      month: z.string().optional(),
      year: z.string().optional(),
      [FormFieldName.DATE_OF_BIRTH]: z.any().superRefine((value, ctx) =>
        validateDateOfBirth(
          {
            day: value?.day as DateOfBirthData['day'],
            month: value?.month as DateOfBirthData['month'],
            year: value?.year as DateOfBirthData['year'],
          },
          ctx,
        ),
      ),
      [FormFieldName.MEMORABLE_WORD]: z
        .string()
        .trim()
        .min(1, { error: FORM_FIELD_CONTENT_KEY.memorableWord })
        .max(50, { error: FORM_FIELD_CONTENT_KEY.memorableWord }),
    }),
  ),
  [StepName.COMMUNICATION_PREFERENCES]: z.object({
    // Custom validation for preferredMethodOfCommunication to handle both string and array inputs
    [FormFieldName.COMMUNICATION_METHOD]: z.preprocess(
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
        error: FORM_FIELD_CONTENT_KEY.communicationMethod,
      }),
    ),
    [FormFieldName.COMMUNICATION_LARGE_PRINT]: z.string({
      error: FORM_FIELD_CONTENT_KEY.communicationLargePrint,
    }),
    [FormFieldName.COMMUNICATION_CONTACT_YOU]: z.string({
      error: FORM_FIELD_CONTENT_KEY.communicationContactYou,
    }),
  }),
  [StepName.ADDRESS_LOOKUP]: z.object({
    [FormFieldName.LOOKUP_POSTCODE]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.lookupPostcode })
      .max(10, { error: FORM_FIELD_CONTENT_KEY.lookupPostcode }),
    [FormFieldName.LOOKUP_ADDRESS_LINE_1]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.lookupAddressLine1 })
      .max(100, { error: FORM_FIELD_CONTENT_KEY.lookupAddressLine1 }),
  }),
  [StepName.ADDRESS_DETAILS]: z.object({
    [FormFieldName.ADDRESS_LINE_1]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.addressLine1 })
      .max(100, { error: FORM_FIELD_CONTENT_KEY.addressLine1 }),
    [FormFieldName.CITY]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.city })
      .max(50, { error: FORM_FIELD_CONTENT_KEY.city }),
    [FormFieldName.POSTCODE]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.postcode })
      .max(10, { error: FORM_FIELD_CONTENT_KEY.postcode }),
    [FormFieldName.COUNTRY]: z
      .string()
      .trim()
      .min(1, { error: FORM_FIELD_CONTENT_KEY.country })
      .max(50, { error: FORM_FIELD_CONTENT_KEY.country }),
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
      [FormFieldName.REFERENCE_NUMBER]: z
        .string()
        .trim()
        .min(1, { error: FORM_FIELD_CONTENT_KEY.referenceNumber })
        .max(50, { error: FORM_FIELD_CONTENT_KEY.referenceNumber }),
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
    [FormFieldName.APPOINTMENT_FOUND_ACTION]: z.string({
      error: FORM_FIELD_CONTENT_KEY.appointmentFoundAction,
    }),
  }),
};
