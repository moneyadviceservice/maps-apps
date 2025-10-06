import { Partner } from 'lib/types/aboutYou';
import { z } from 'zod';

import { ErrorType } from '@maps-react/common/components/Errors';

const getAge = (dob: { day?: string; month?: string; year?: string }) => {
  if (!dob.day || !dob.month || !dob.year) return null;
  const birthDate = new Date(
    Number(dob.year),
    Number(dob.month) - 1,
    Number(dob.day),
  );
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
export const PartnerSchema = z.object({
  id: z.number().min(1),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  dob: z
    .object({
      day: z.string().optional(),
      month: z.string().optional(),
      year: z.string().optional(),
    })
    .superRefine((dob, ctx) => {
      const age = getAge(dob);
      if (age === null || age < 18 || age > 100) {
        ctx.addIssue({
          code: 'custom',
          message: 'Error: You must enter your day of birth',
        });
      }
    }),
  gender: z
    .string()
    .min(1, { message: 'Error: Please enter your gender to continue.' })
    .regex(/^(male|female)$/i, {
      message: 'Error: Please enter your gender to continue.',
    }),
  retireAge: z
    .string()
    .min(1, { message: 'Retirement age is required' })
    .refine(
      (val) => {
        const age = Number(val);
        return !Number.isNaN(age) && age >= 50 && age <= 75;
      },
      { message: "Error: Can't be blank" },
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
  errorMessages?: Record<keyof Partner, string> | null,
): string | undefined => errorMessages?.[key as keyof Partner];

export const hasFieldError = (
  key: string,
  errorMessages: Record<string, string> | null | undefined,
): Array<ErrorType> => {
  const value = errorMessages?.[key];
  const fieldHasError = typeof value === 'string' && value !== '';
  return fieldHasError ? [{} as ErrorType] : [];
};
