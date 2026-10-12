import { z } from 'zod';

const envSchema = z.object({
  BASE_URL: z.string().optional(),
  SITE_PASSWORD: z.string().optional(),
  AEM_USERAGENT: z.string().optional(),
  CI: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
