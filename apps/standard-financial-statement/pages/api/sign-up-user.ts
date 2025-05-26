import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  return response.status(200).json({ message: 'Hello World!' });
}

export const userSchema = z.object({
  orgLicenceNumber: z.string().min(1, 'required'),
  firstName: z.string().min(1, 'required'),
  lastName: z.string().min(1, 'required'),
  emailAddress: z.string().min(1, 'required').email('invalid'),
  tel: z.string().min(1, 'required'),
  jobTitle: z.string().min(1, 'required'),
  password: z.string().min(1, 'required'),
  codeOfConduct: z.boolean().refine((val) => val === true),
});
