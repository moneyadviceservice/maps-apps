import type { NextApiRequest, NextApiResponse } from 'next';

import { getSessionId } from 'utils/getSessionId';
import { isJsonRequest, requestField } from 'utils/requestField';

export type JourneyApiResult = {
  valid: boolean;
  redirectPath: string;
  errors?: Record<string, string[]>;
};

export type ParsedJourneyApiRequest<TAction extends string> = {
  body: Record<string, unknown>;
  jsonRequest: boolean;
  action: TAction;
  language: string;
  sessionId: string;
};

export const rejectIfNotPost = (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  if (request.method === 'POST') {
    return false;
  }

  response.setHeader('Allow', 'POST');
  response.status(405).json({ message: 'Method not allowed' });
  return true;
};

export const parseJourneyApiRequest = <TAction extends string>(
  request: NextApiRequest,
  actions: Set<TAction>,
  fallbackAction: TAction,
): ParsedJourneyApiRequest<TAction> => {
  const body = (request.body ?? {}) as Record<string, unknown>;
  const rawAction = requestField(request, 'action');
  const action =
    rawAction && actions.has(rawAction as TAction)
      ? (rawAction as TAction)
      : fallbackAction;

  return {
    body,
    jsonRequest: isJsonRequest(request),
    action,
    language: requestField(request, 'language') || 'en',
    sessionId: getSessionId(requestField(request, 'sessionId')),
  };
};

export const sendJourneyResult = (
  response: NextApiResponse,
  jsonRequest: boolean,
  result: JourneyApiResult,
) => {
  if (jsonRequest) {
    return response.status(200).json({
      success: result.valid,
      redirectPath: result.redirectPath,
      errors: result.errors,
    });
  }

  return response.redirect(303, result.redirectPath);
};

export const sendJourneyError = (
  response: NextApiResponse,
  jsonRequest: boolean,
  message: string,
) => {
  if (jsonRequest) {
    return response.status(500).json({ success: false, message });
  }

  return response.status(500).json({ message });
};
