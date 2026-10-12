import { NotifyClient } from 'notifications-node-client';

export async function tidInvalidFrn(firstName: string, emailAddress: string) {
  const notifyApiKey = process.env.NOTIFY_API_KEY;
  const templateIdInvalidFrn = process.env.NOTIFY_TEMPLATE_INVALID_FRN;

  if (!notifyApiKey || !templateIdInvalidFrn) {
    return new Error(
      'Missing env variables (notifyApiKey, templateIdInvalidFrn, baseUrl) - unable to send email.',
    );
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  try {
    await notifyClient.sendEmail(templateIdInvalidFrn, emailAddress, {
      personalisation: {
        first_name: firstName,
      },
    });

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the email', err);

    return new Error('Invalid FRN email not sent');
  }
}
