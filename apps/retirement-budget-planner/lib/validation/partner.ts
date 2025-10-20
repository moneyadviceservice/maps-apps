import { Partner } from 'lib/types/aboutYou';
import { z } from 'zod';

import { ErrorType } from '@maps-react/common/components/Errors';

import {
  validateDobAgeRange,
  validateDobEmpty,
  validateDobFieldPresence,
} from './dobValidation';

export const PartnerSchema = z.object({
  id: z.number().min(1),
  name: z
    .string()
    .min(1, { message: 'name-generic' })
    .max(50, { message: 'name-generic' }),
  dob: z
    .object({
      day: z.string().optional(),
      month: z.string().optional(),
      year: z.string().optional(),
    })
    .superRefine((dob, ctx) => {
      if (validateDobEmpty(dob, ctx)) return;
      if (validateDobFieldPresence(dob, ctx)) return;
      validateDobAgeRange(dob, ctx);
    }),
  gender: z
    .string()
    .min(1, { message: 'gender-generic' })
    .regex(/^(male|female)$/i, {
      message: 'gender-generic',
    }),
  retireAge: z
    .string()
    .min(1, { message: 'retire-age-empty' })
    .refine(
      (val) => {
        if (typeof val !== 'string' || val.trim() === '') return true;
        const age = Number(val);
        return !Number.isNaN(age) && age >= 50 && age <= 75;
      },
      { message: 'retire-age-range' },
    ),
});

export type PartnerType = z.infer<typeof PartnerSchema>;
export function formattedPartnerErrors(
  error: z.ZodError<PartnerType>,
): Record<keyof Partner, string> {
  const fieldErrors = {
    id: '',
    name: '',
    dob: '',
    gender: '',
    retireAge: '',
  };

  for (const err of error.issues) {
    const field = err.path[0] as keyof Partner;
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = err.message;
    }
  }

  return fieldErrors;
}

export function validateForm(partner: Partner) {
  const result = PartnerSchema.safeParse(partner);
  if (!result.success) {
    const fieldErrors = formattedPartnerErrors(result.error);
    return fieldErrors;
  }
  return null;
}

export const getErrorMessageByKey = (
  key: string,
  errorMessages?: Record<string, string> | null,
): string | undefined => errorMessages?.[key];

export const hasFieldError = (
  key: string,
  errorMessages: Record<string, string> | null | undefined,
): Array<ErrorType> => {
  const value = errorMessages?.[key];
  const fieldHasError = typeof value === 'string' && value !== '';
  return fieldHasError ? [{} as ErrorType] : [];
};
