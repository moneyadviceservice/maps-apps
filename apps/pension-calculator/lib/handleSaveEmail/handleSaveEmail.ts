import { JOURNEY_PAGES } from 'data/journey';
import { SAVE_EMAIL_ERROR, SAVE_SEND_ERROR } from 'data/save';
import { NotifyClient } from 'notifications-node-client';
import { journeyPath, safeReturnTo } from 'utils/journeyPath';

import { validateEmail } from '@maps-react/utils/validateEmail';

export type SaveEmailInput = {
  email: string;
  language: string;
  sessionId: string;
  returnTo?: string;
};

type NotifyResult = {
  status?: number;
  data?: {
    id?: string;
    status?: string;
  };
};

const notifyAcceptedStatuses = new Set(['delivered', 'sending', 'created']);

const notifyErrorDetails = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return error instanceof Error ? error.message : 'Unknown Notify error';
  }

  const response = (error as { response?: { status?: number; data?: unknown } })
    .response;

  return { status: response?.status, data: response?.data };
};

const savePage = (
  language: string,
  sessionId: string,
  returnTo: string,
  error: typeof SAVE_EMAIL_ERROR | typeof SAVE_SEND_ERROR,
) =>
  journeyPath(language, JOURNEY_PAGES.SAVE, sessionId, {
    error,
    returnTo,
  });

const sendFailed = (language: string, sessionId: string, returnTo: string) => ({
  valid: false as const,
  redirectPath: savePage(language, sessionId, returnTo, SAVE_SEND_ERROR),
});

export const handleSaveEmail = async ({
  email,
  language,
  sessionId,
  returnTo,
}: SaveEmailInput) => {
  const destination = safeReturnTo(returnTo, language, sessionId);

  if (!validateEmail(email.trim())) {
    return {
      valid: false,
      redirectPath: savePage(
        language,
        sessionId,
        destination,
        SAVE_EMAIL_ERROR,
      ),
    };
  }

  const apiKey = process.env.NOTIFY_API_KEY;
  const templateId = process.env.NOTIFY_TEMPLATE_ID;
  if (!apiKey || !templateId) {
    console.error('Notify is not configured for the save email');
    return sendFailed(language, sessionId, destination);
  }

  try {
    const notifyClient = new NotifyClient(apiKey);
    const sent = (await notifyClient.sendEmail(
      templateId,
      email.trim(),
    )) as NotifyResult;

    if (sent.status !== 201 || !sent.data?.id) {
      console.error('Notify did not accept the save email', sent.status);
      return sendFailed(language, sessionId, destination);
    }

    const notification = (await notifyClient.getNotificationById(
      sent.data.id,
    )) as NotifyResult;
    const notificationStatus = notification.data?.status;

    if (
      notification.status !== 200 ||
      !notificationStatus ||
      !notifyAcceptedStatuses.has(notificationStatus)
    ) {
      console.error('Notify reported a failure status', notificationStatus);
      return sendFailed(language, sessionId, destination);
    }
  } catch (error) {
    console.error('Failed to send save email', notifyErrorDetails(error));
    return sendFailed(language, sessionId, destination);
  }

  return {
    valid: true,
    redirectPath: journeyPath(
      language,
      JOURNEY_PAGES.PROGRESS_SAVED,
      sessionId,
      { returnTo: destination },
    ),
  };
};
