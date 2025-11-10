import { z } from 'zod';

const passwordRegex = new RegExp(
  [
    '^',

    // Require 3 out of 4 character types using a single positive lookahead.
    '(?=',
    '(?:',
    // 1. Lowercase, Uppercase, and Numbers
    '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
    '|',
    // 2. Lowercase, Uppercase, and Symbols
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*\\-_=\\+\\[\\]{}|\\\\:\'",.?/`~"();<>])',
    '|',
    // 3. Lowercase, Numbers, and Symbols
    '(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*\\-_=\\+\\[\\]{}|\\\\:\'",.?/`~"();<>])',
    '|',
    // 4. Uppercase, Numbers, and Symbols
    '(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*\\-_=\\+\\[\\]{}|\\\\:\'",.?/`~"();<>])',
    ')',
    ')',

    // Enforce allowed characters (including space) and length.
    // This part actually consumes the characters of the string.
    '[A-Za-z0-9!@#$%^&*\\-_=\\+\\[\\]{}|\\\\:\'",.?/`~"();<> ]{8,256}',

    '$',
  ].join(''),
);

const EXCLUDED_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'ymail.com',
  'rocketmail.com',
  'protonmail.com',
  'proton.me',
  'mail.com',
  'gmx.com',
]);

export const userSchema = z
  .object({
    orgLicenceNumber: z.string().nonempty({ error: 'required' }).optional(),
    firstName: z.string().nonempty({ error: 'required' }),
    lastName: z.string().nonempty({ error: 'required' }),
    emailAddress: z
      .string()
      .nonempty({ error: 'required' })
      .email({ error: 'invalid' })
      .refine((email) => {
        const emailDomain = email.split('@').pop()?.toLowerCase();
        return !emailDomain || !EXCLUDED_DOMAINS.has(emailDomain);
      }, 'not_allowed'),
    tel: z.string().nonempty({ error: 'required' }),
    jobTitle: z.string().nonempty({ error: 'required' }),
    password: z.string().nonempty({ error: 'required' }),
    confirmPassword: z.string().nonempty({ error: 'required' }),
    codeOfConduct: z.boolean().refine((val) => val === true),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    // First check if passwords match - this runs before strength validation
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'invalid_type',
        message: 'match',
        expected: 'string',
        received: 'string',
        path: ['password'],
      });

      ctx.addIssue({
        code: 'invalid_type',
        message: 'match',
        expected: 'string',
        received: 'string',
        path: ['confirmPassword'],
      });
      return; // Exit early if passwords don't match - don't validate strength
    }

    if (!passwordRegex.test(password)) {
      ctx.addIssue({
        code: 'custom',
        message: 'strength',
        path: ['password'],
      });
    }

    if (!passwordRegex.test(confirmPassword)) {
      ctx.addIssue({
        code: 'custom',
        message: 'strength',
        path: ['confirmPassword'],
      });
    }
  });

export type UserFormData = z.infer<typeof userSchema>;

export function validateUserForm(data: Record<string, unknown>) {
  const parsed = userSchema.safeParse({
    ...data,
    codeOfConduct: data['codeOfConduct'] === 'true',
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}
