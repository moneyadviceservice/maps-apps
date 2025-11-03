import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

/**
 * When running `npx nx serve pensions-dashboard`,
 * it will parse this file with the current working directory of root.
 */
const envFilePath = resolve(__dirname, '../../../', '.env.local');

dotenv.config({
  path: envFilePath,
});

const envSchema = z.object({
  BASE_URL: z
    .string()
    .optional()
    .default('http://localhost:4100')
    .transform((url) => {
      try {
        return new URL(url).origin;
      } catch {
        throw new Error('Invalid BASE_URL format, must be a valid http(s) URL');
      }
    }),
  MHPD_API_URL: z
    .string()
    .optional()
    .default('http://localhost:4100')
    .refine(
      (url) => url.startsWith('http') || url.startsWith('https'),
      'Invalid MHPD_API_URL format',
    ),
  NETLIFY_PASSWORD: z.string().min(5).optional().default('dummy-password'),
  MHPD_API_TEST_TICKET: z.string().min(5).optional().default('dummy-ticket'),
  MHPD_NETLIFY_PAT: z.string().min(5).optional().default('dummy-pat'),
  MHPD_COMPOSER_API_URL: z.string().min(5).optional().default('dummy-url'),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
