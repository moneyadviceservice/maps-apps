import { z } from 'zod';

const validateEmail = (email: string) => {
  return /^((?!\.)[\w\-.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.])$/.exec(
    email.toLowerCase(),
  );
};

const emailValidationSchema = z.object({
  email1: z.any().refine(
    (val) => {
      if (typeof val !== 'string') return false;
      const trimmed = val.trim();
      return trimmed !== '' && !!validateEmail(trimmed);
    },
    {
      message: 'email-generic',
    },
  ),
  email2: z.any().refine(
    (val) => {
      if (val === undefined || val === null) return true;
      if (typeof val !== 'string') return false;
      const trimmed = val.trim();
      return trimmed === '' || !!validateEmail(trimmed);
    },
    {
      message: 'email-generic',
    },
  ),
});
export const validateEmails = (
  email1: string | undefined,
  email2: string | undefined,
) => {
  const result = emailValidationSchema.safeParse({ email1, email2 });
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const err of result.error.issues) {
      const rawField = err.path[0];
      if (
        (typeof rawField === 'string' || typeof rawField === 'number') &&
        !fieldErrors[String(rawField)]
      ) {
        fieldErrors[String(rawField)] = err.message;
      }
    }
    return fieldErrors;
  }
  return null;
};
