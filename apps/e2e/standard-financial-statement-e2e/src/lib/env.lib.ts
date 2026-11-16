import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

const envFilePath = resolve(__dirname, '../../', '.env.local');

dotenv.config({
  path: envFilePath,
});

const envSchema = z.object({
  BASE_URL: z
    .string()
    .default('http://localhost:8888')
    .refine((value) => {
      try {
        return Boolean(new URL(value));
      } catch {
        return false;
      }
    }),
  PROJECT_NAME: z.string().default('standard-financial-statement'),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);

/**
 * Builds an absolute application URL from a site path.
 *
 * @param path - Path beginning with `/`, e.g. `/en/apply-to-use-the-sfs`
 */
export function appUrl(path: string): string {
  const base = ENV.BASE_URL.replace(/\/$/, '');
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalisedPath}`;
}
