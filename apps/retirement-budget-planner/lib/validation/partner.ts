import { Partner } from 'lib/types/aboutYou';
import { z } from 'zod';

import { ErrorType } from '@maps-react/common/components/Errors';

import {
  validateDobAgeRange,
  validateDobEmpty,
  validateDobFieldPresence,
  validateDobInvalidDate,
} from './dobValidation';

export const NameSchema = z
  .string()
  .transform((name) => (typeof name === 'string' ? name.trim() : ''))
  .refine((name) => name !== '', { message: 'name-generic' })
  .refine((name) => name.length >= 2 && name.length <= 30, {
    message: 'name-length',
  })
  .refine((name) => /^[a-zA-Z\s'-]+$/.test(name), { message: 'name-invalid' });

export function validateName(
  id: number,
  name: string,
  formErrors: Record<string, string> | null,
): Record<string, string> | null {
  const result = NameSchema.safeParse(name);
  if (result.success) return null;

  const firstIssue = result.error.issues[0];
  const message = firstIssue?.message ?? '';

  const fieldErrors: Record<string, string> = {
    ...formErrors,
    name: message,
    id: id.toString(),
  };

  return fieldErrors;
}

export const PartnerSchema = z.object({
  id: z.number().min(1),
  name: NameSchema,
  dob: z
    .object({
      day: z.string().optional(),
      month: z.string().optional(),
      year: z.string().optional(),
    })
    .superRefine((dob, ctx) => {
      if (validateDobEmpty(dob, ctx)) return;
      if (validateDobFieldPresence(dob, ctx)) return;
      if (validateDobInvalidDate(dob, ctx)) return;
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
        return !Number.isNaN(age) && age >= 55 && age <= 99;
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

export function validateForm(partners: Partner[]) {
  const validationResults = partners.map((partner) => {
    const result = validatePartner(partner);
    if (result) {
      return { ...result, id: partner.id.toString() };
    }
  });
  return validationResults.filter((result) => result !== undefined);
}

export function validatePartner(partner: Partner) {
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

export const partnerError = (
  formError: (Record<string, string> | undefined)[] | null,
  partnerId: number,
) => {
  if (!formError) return null;

  const partnerErrors = formError.find(
    (error) => !!error && Number(error.id) === partnerId,
  );
  return partnerErrors || null;
};

export const updatePartnerErrors = (
  formErrors: (Record<string, string> | undefined)[] | null,
  partnerErrors: Record<string, string>,
): (Record<string, string> | undefined)[] => {
  if (!formErrors) return [partnerErrors];
  if (formErrors.length === 1 && Number(partnerErrors.id) === 2)
    return [...formErrors, partnerErrors];
  return formErrors.map((error) => {
    if (!error) return partnerErrors;
    if (error && Number(error.id) === Number(partnerErrors.id)) {
      return partnerErrors;
    }
    return error;
  });
};

export const findPartnerNameError = (partners: Partner[]) =>
  partners.map((partner) => {
    const result = NameSchema.safeParse(partner.name);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      if (firstIssue?.message !== '') {
        return { name: firstIssue.message, id: partner.id.toString() };
      }
    }
  });
export const hasNameError = (partners: Partner[]): boolean =>
  findPartnerNameError(partners).some((error) => error !== undefined);
