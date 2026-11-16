import type { NextApiRequest, NextApiResponse } from 'next';

import { rejectIfNotPost, sendJourneyError } from 'lib/handleJourneyApiRequest';
import { handleSaveEmail } from 'lib/handleSaveEmail/handleSaveEmail';
import { getSessionId } from 'utils/getSessionId';
import { isJsonRequest, requestField } from 'utils/requestField';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (rejectIfNotPost(request, response)) {
    return;
  }

  const jsonRequest = isJsonRequest(request);

  try {
    const result = await handleSaveEmail({
      email: requestField(request, 'email') ?? '',
      language: requestField(request, 'language') || 'en',
      sessionId: getSessionId(requestField(request, 'sessionId')),
      returnTo: requestField(request, 'returnTo'),
    });

    if (jsonRequest) {
      response.status(200).json(result);
      return;
    }

    response.redirect(303, result.redirectPath);
  } catch (error) {
    console.error('Failed to save and send email', error);
    sendJourneyError(response, jsonRequest, 'Failed to save and send email');
  }
}
