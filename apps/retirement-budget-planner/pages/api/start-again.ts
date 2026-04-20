import { NextApiRequest, NextApiResponse } from 'next';

import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { deleteAllSessionData } from 'lib/util/deleteAllSessionData';
import { z } from 'zod';

const StartAgainBodySchema = z.object({
  language: z.string(),
  sessionId: z.string(),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { body } = request;
  const parsedBody = StartAgainBodySchema.safeParse(body);

  // Return error if the required input data is invalid
  if (!parsedBody.success) {
    return response.status(400).json({
      message: 'Invalid request body',
      errors: parsedBody.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(' - '),
    });
  }

  const { language, sessionId } = parsedBody.data;

  // Delete all Redis keys for each page of the app – we shouldn't need to worry
  // if this fails, as the Redis cache will expire and be flushed automatically
  // after a short period of time (60 minutes by default)
  await deleteAllSessionData(sessionId);

  // Redirect back to the first page, removing any URL query session data
  return response.redirect(303, `/${language}/${PAGES_NAMES.ABOUTYOU}`);
}
