import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

/**
 * When running `npx nx serve app-name-here`,
 * it will parse this file with the current working directory of root.
 */

const envFilePath = resolve(__dirname, '../', '.env.local');
dotenv.config({
  path: envFilePath,
});

const envSchema = z.object({
  CI: z.string().optional(),
  MOCK_API_PORT: z.string().optional(),
  APPOINTMENTS_API: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;
export const ENV: Env = envSchema.parse(process.env);
