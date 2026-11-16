import type { NextApiRequest, NextApiResponse } from 'next';

import {
  JOURNEY_ACTIONS,
  JOURNEY_PAGES,
  type JourneyAction,
} from 'data/journey';
import {
  parseJourneyApiRequest,
  rejectIfNotPost,
  sendJourneyError,
  sendJourneyResult,
} from 'lib/handleJourneyApiRequest';
import { handleStatePensionAction } from 'lib/handleStatePensionAction';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';

const ACTIONS = new Set<JourneyAction>(JOURNEY_ACTIONS);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (rejectIfNotPost(request, response)) {
    return;
  }

  const { body, jsonRequest, action, language, sessionId } =
    parseJourneyApiRequest(request, ACTIONS, 'continue');
  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.STATE_PENSION,
    language,
    sessionId,
  });
  if ('redirect' in access) {
    return sendJourneyResult(response, jsonRequest, {
      valid: false,
      redirectPath: access.redirect.destination,
    });
  }

  try {
    const result = await handleStatePensionAction({
      action,
      body,
      language,
      sessionId,
    });

    return sendJourneyResult(response, jsonRequest, result);
  } catch (error) {
    console.error('Failed to persist state pension', error);
    return sendJourneyError(
      response,
      jsonRequest,
      'Failed to persist state pension',
    );
  }
}
