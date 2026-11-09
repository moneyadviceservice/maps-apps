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
import { handleRetirementIncomeAction } from 'lib/handleRetirementIncomeAction';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';

const ACTIONS = new Set<JourneyAction>(JOURNEY_ACTIONS);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (rejectIfNotPost(request, response)) {
    return;
  }

  const { jsonRequest, action, language, sessionId } = parseJourneyApiRequest(
    request,
    ACTIONS,
    'continue',
  );
  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.RETIREMENT_INCOME,
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
    const result = handleRetirementIncomeAction({
      action,
      language,
      sessionId,
    });

    return sendJourneyResult(response, jsonRequest, result);
  } catch (error) {
    console.error('Failed to continue from retirement income', error);
    return sendJourneyError(
      response,
      jsonRequest,
      'Failed to continue from retirement income',
    );
  }
}
