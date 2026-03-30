import { NotifyClient } from 'notifications-node-client';

export async function tidRegisterUnsuccessful(
  firstName: string,
  lastName: string,
  FRN: string,
  email: string,
) {
  const notifyApiKey = process.env.NOTIFY_API_KEY;
  const templateIdRegisterUnuccessful =
    process.env.NOTIFY_TEMPLATE_REGISTER_UNSECCESSFUL;
  const adminEmail = process.env.NOTIFY_ADMIN_EMAIL;

  if (!notifyApiKey || !templateIdRegisterUnuccessful || !adminEmail) {
    const error =
      'Missing env variables (notifyApiKey, templateIdRegisterUnuccessful, adminEmail) - unable to send email.';
    console.warn(error);

    return new Error(error);
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  try {
    await notifyClient.sendEmail(templateIdRegisterUnuccessful, adminEmail, {
      personalisation: {
        first_name: firstName,
        last_name: lastName,
        FRN: FRN,
        email: email,
      },
    });

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the email', err);

    return new Error('signup email not sent');
  }
}
