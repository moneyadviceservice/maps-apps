import type { NextApiRequest, NextApiResponse } from 'next';

import { JOURNEY_ACTIONS } from 'data/journey';
import {
  parseJourneyApiRequest,
  rejectIfNotPost,
  sendJourneyError,
  sendJourneyResult,
} from 'lib/handleJourneyApiRequest';
import { handlePensionsAction } from 'lib/handlePensionsAction';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import type { PensionsAction, PensionsFlow, PensionStep } from 'types/pensions';
import { requestField } from 'utils/requestField';

const ACTIONS = new Set<PensionsAction>([
  ...JOURNEY_ACTIONS,
  'add',
  'remove',
  'update',
]);
const STEPS = new Set<PensionStep>(['screening', 'details']);
const FLOWS = new Set<PensionsFlow>(['pots-of-money', 'income-pensions']);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (rejectIfNotPost(request, response)) {
    return;
  }

  const { body, jsonRequest, action, language, sessionId } =
    parseJourneyApiRequest(request, ACTIONS, 'continue');

  const rawFlow = requestField(request, 'flow');
  const flow = FLOWS.has(rawFlow as PensionsFlow)
    ? (rawFlow as PensionsFlow)
    : 'pots-of-money';

  const access = await requireJourneyAccess({
    page: flow,
    language,
    sessionId,
  });

  if ('redirect' in access) {
    return sendJourneyResult(response, jsonRequest, {
      valid: false,
      redirectPath: access.redirect.destination,
    });
  }

  const rawStep = requestField(request, 'step');
  const step = STEPS.has(rawStep as PensionStep)
    ? (rawStep as PensionStep)
    : 'screening';

  try {
    const result = await handlePensionsAction({
      action,
      step,
      flow,
      body,
      language,
      sessionId,
      removeIndex: Number(requestField(request, 'index')),
    });

    return sendJourneyResult(response, jsonRequest, result);
  } catch (error) {
    console.error('Failed to persist pension information', error);
    return sendJourneyError(
      response,
      jsonRequest,
      'Failed to persist pension information',
    );
  }
}
