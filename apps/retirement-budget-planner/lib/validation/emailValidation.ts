import { z } from 'zod';

import { validateEmail } from '@maps-react/utils/validateEmail';

const emailValidationSchema = z.object({
  email: z.any().refine(
    (val) => {
      if (typeof val !== 'string') return false;

      const trimmed = val.trim();
      return trimmed !== '' && !!validateEmail(trimmed);
    },
    {
      message: 'email-generic',
    },
  ),
});

export const validateEmails = (email: string | undefined) => {
  const result = emailValidationSchema.safeParse({ email });

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
