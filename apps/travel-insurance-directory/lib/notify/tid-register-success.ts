import { NotifyClient } from 'notifications-node-client';

export async function tidRegisterSuccess(
  firstName: string,
  emailAddress: string,
) {
  const notifyApiKey = process.env.NOTIFY_API_KEY;
  const templateIdRegisterSuccess =
    process.env.NOTIFY_TEMPLATE_REGISTER_SUCCESS;
  const baseUrl = process.env.BASE_URL;

  if (!notifyApiKey || !templateIdRegisterSuccess) {
    const error =
      'Missing env variables (notifyApiKey, templateIdRegisterSuccess, baseUrl) - unable to send email.';
    console.warn(error);

    return new Error(error);
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  try {
    await notifyClient.sendEmail(templateIdRegisterSuccess, emailAddress, {
      personalisation: {
        first_name: firstName,
        self_serve_url: `${baseUrl}`, // to be updated to self serve link when page is ready
      },
    });

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the email', err);

    return new Error('signup email not sent');
  }
}
