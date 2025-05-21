import { NotifyClient } from 'notifications-node-client';

export async function sfsStatusChange(
  email: string,
  organisation_name: string,
  emailContent = '',
  additionalEmailContent = '',
) {
  const notifyApiKey = process.env.MH_NOTIFY_API_KEY;

  const templateId = process.env.NOTIFY_SFS_STATUS_CHANGE;

  if (!notifyApiKey || !templateId) {
    console.warn('Missing env variables - unable to send email.');

    return new Error('Missing env variables - unable to send email.');
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  try {
    await notifyClient.sendEmail(templateId, email, {
      personalisation: {
        organisation_name,
        emailContent,
        additionalEmailContent,
      },
    });

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the email', err);

    return new Error('Status change email not sent');
  }
}
