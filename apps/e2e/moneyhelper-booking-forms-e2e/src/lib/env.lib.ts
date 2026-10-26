import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

const envFilePath = resolve(__dirname, '../', '.env.local');
dotenv.config({
  path: envFilePath,
});

const envSchema = z.object({
  CI: z.string().optional(),
  EXAMPLE_ENV_VAR: z.string().optional(),
  MOCK_API_PORT: z.coerce.number().default(9000),
  NETLIFY_PORT: z.coerce.number().default(8888),
  PROJECT_NAME: z.string().default('moneyhelper-booking-forms'),
  BASE_URL: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

// Validates raw process.env and exports strongly typed ENV object
export const ENV: Env = envSchema.parse(process.env);

export const envConfig = {
  isCI: Boolean(ENV.CI),
  baseURL: ENV.BASE_URL ?? `http://localhost:${ENV.NETLIFY_PORT}`,
};
