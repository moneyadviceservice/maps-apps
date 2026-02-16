/* eslint-disable no-restricted-properties */
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

/**
 * When running `npx nx serve pensions-dashboard`,
 * it will parse this file with the current working directory of root.
 */
const envFilePath = resolve(__dirname, '../', '.env.local');

dotenv.config({
  path: envFilePath,
});

const transformUrl = (envVarName: string) => (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    throw new Error(
      `Invalid ${envVarName} format, must be a valid http(s) URL`,
    );
  }
};

const envSchema = z.object({
  E2E_TARGET: z.string().optional(),
  LT_USERNAME: z.string().optional(),
  LT_ACCESS_KEY: z.string().optional(),
  BASE_URL: z
    .string()
    .optional()
    .default('http://localhost:4100')
    .transform(transformUrl('BASE_URL')),
  MHPD_API_URL: z
    .string()
    .optional()
    .default('http://localhost:4100')
    .refine(transformUrl('MHPD_API_URL')),
  NETLIFY_PASSWORD: z.string().min(5).optional().default('dummy-password'),
  MHPD_API_TEST_TICKET: z.string().min(5).optional().default('dummy-ticket'),
  MHPD_NETLIFY_PAT: z.string().min(5).optional().default('dummy-pat'),
  MHPD_COMPOSER_API_URL: z.string().min(5).optional().default('dummy-url'),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
