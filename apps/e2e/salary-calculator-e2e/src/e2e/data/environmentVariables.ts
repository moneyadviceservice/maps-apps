import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

/**
 * Environment variables configuration for Salary Calculator E2E tests
 * Supports running tests against local and dev environments
 */

// Load .env.local file from the e2e project root if it exists
const envFilePath = resolve(__dirname, '../../../', '.env.local');

dotenv.config({
  path: envFilePath,
});

const envSchema = z.object({
  BASE_URL: z
    .string()
    .optional()
    .default('http://localhost:4390')
    .transform((url) => {
      try {
        // Validate URL format and return origin
        return new URL(url).origin;
      } catch {
        throw new Error('Invalid BASE_URL format, must be a valid http(s) URL');
      }
    }),
  HTTP_PASSWORD: z
    .string()
    .optional()
    .default('dummy-password')
    .describe('Password for Netlify-protected environments'),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
