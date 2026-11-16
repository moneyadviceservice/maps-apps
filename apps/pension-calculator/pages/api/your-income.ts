import type { NextApiRequest, NextApiResponse } from 'next';

import { JOURNEY_ACTIONS, JOURNEY_PAGES } from 'data/journey';
import {
  parseJourneyApiRequest,
  rejectIfNotPost,
  sendJourneyError,
  sendJourneyResult,
} from 'lib/handleJourneyApiRequest';
import {
  handleYourIncomeAction,
  type YourIncomeAction,
} from 'lib/handleYourIncomeAction';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { requestField } from 'utils/requestField';

const ACTIONS = new Set<YourIncomeAction>([
  ...JOURNEY_ACTIONS,
  'add',
  'remove',
  'update',
]);

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
    page: JOURNEY_PAGES.YOUR_INCOME,
    language,
    sessionId,
  });
  if ('redirect' in access) {
    return sendJourneyResult(response, jsonRequest, {
      valid: false,
      redirectPath: access.redirect.destination,
    });
  }

  const removeIndex = Number(requestField(request, 'index'));

  try {
    const result = await handleYourIncomeAction({
      action,
      body,
      language,
      sessionId,
      removeIndex: Number.isFinite(removeIndex) ? removeIndex : undefined,
    });

    return sendJourneyResult(response, jsonRequest, result);
  } catch (error) {
    console.error('Failed to persist your income', error);
    return sendJourneyError(
      response,
      jsonRequest,
      'Failed to persist your income',
    );
  }
}
