import { z } from 'zod';

export const validateEmail = (email: string): boolean => {
  return z.email().safeParse(email).success;
};
