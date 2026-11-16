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

export type SaveEmailError = typeof SAVE_EMAIL_ERROR | typeof SAVE_SEND_ERROR;

export type SaveResponse = {
  success: boolean;
  redirectPath: string;
  email?: string;
  error?: SaveEmailError;
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
  error: SaveEmailError,
) =>
  journeyPath(language, JOURNEY_PAGES.SAVE, sessionId, {
    error,
    returnTo,
  });

const sendFailed = (
  language: string,
  sessionId: string,
  returnTo: string,
  submittedEmail: string,
): SaveResponse => ({
  success: false,
  email: submittedEmail,
  error: SAVE_SEND_ERROR,
  redirectPath: savePage(language, sessionId, returnTo, SAVE_SEND_ERROR),
});

export const handleSaveEmail = async ({
  email,
  language,
  sessionId,
  returnTo,
}: SaveEmailInput): Promise<SaveResponse> => {
  const destination = safeReturnTo(returnTo, language, sessionId);
  const submittedEmail = email.trim();

  if (!validateEmail(submittedEmail)) {
    return {
      success: false,
      email: submittedEmail,
      error: SAVE_EMAIL_ERROR,
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
    return sendFailed(language, sessionId, destination, submittedEmail);
  }

  try {
    const notifyClient = new NotifyClient(apiKey);
    const sent = (await notifyClient.sendEmail(
      templateId,
      submittedEmail,
    )) as NotifyResult;

    if (sent.status !== 201 || !sent.data?.id) {
      console.error('Notify did not accept the save email', sent.status);
      return sendFailed(language, sessionId, destination, submittedEmail);
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
      return sendFailed(language, sessionId, destination, submittedEmail);
    }
  } catch (error) {
    console.error('Failed to send save email', notifyErrorDetails(error));
    return sendFailed(language, sessionId, destination, submittedEmail);
  }

  return {
    success: true,
    redirectPath: journeyPath(
      language,
      JOURNEY_PAGES.PROGRESS_SAVED,
      sessionId,
      { returnTo: destination },
    ),
  };
};
