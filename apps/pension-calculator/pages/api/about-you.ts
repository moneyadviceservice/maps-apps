import type { NextApiRequest, NextApiResponse } from 'next';

import { JOURNEY_ACTIONS } from 'data/journey';
import {
  type AboutYouAction,
  handleAboutYouAction,
} from 'lib/handleAboutYouAction';
import {
  parseJourneyApiRequest,
  rejectIfNotPost,
  sendJourneyError,
  sendJourneyResult,
} from 'lib/handleJourneyApiRequest';

const ACTIONS = new Set<AboutYouAction>(JOURNEY_ACTIONS);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (rejectIfNotPost(request, response)) {
    return;
  }

  const { body, jsonRequest, action, language, sessionId } =
    parseJourneyApiRequest(request, ACTIONS, 'continue');

  try {
    const result = await handleAboutYouAction({
      action,
      body,
      language,
      sessionId,
    });

    return sendJourneyResult(response, jsonRequest, result);
  } catch (error) {
    console.error('Failed to persist about you', error);
    return sendJourneyError(
      response,
      jsonRequest,
      'Failed to persist about you',
    );
  }
}
