import { NotifyClient } from 'notifications-node-client';

export async function sfsSignUp(
  firstName: string,
  emailAddress: string,
  organisationName: string,
  orgId: string,
) {
  const notifyApiKey = process.env.SFS_NOTIFY_API_KEY;

  const templateIdUser = process.env.NOTIFY_SFS_APPLICATION_USER;
  const templateIdAdmin = process.env.NOTIFY_SFS_APPLICATION_ADMIN;
  const adminEmail = process.env.NOTIFY_ADMIN_EMAIL;
  const adminUrl = process.env.APP_ROOT;

  if (!notifyApiKey || !templateIdUser || !templateIdAdmin) {
    const error =
      'Missing env variables (notifyApiKey, templateIdUser, templateIdAdmin) - unable to send email.';
    console.warn(error);

    return new Error(error);
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  try {
    await notifyClient.sendEmail(templateIdAdmin, adminEmail, {
      personalisation: {
        organisation_name: organisationName,
        first_name: firstName,
        admin_link: `${adminUrl}admin/${orgId}`,
      },
      emailReplyToId: process.env.NOTIFY_SFS_REPLY_TO,
    });

    await notifyClient.sendEmail(templateIdUser, emailAddress, {
      personalisation: {
        organisation_name: organisationName,
        first_name: firstName,
      },
      emailReplyToId: process.env.NOTIFY_SFS_REPLY_TO,
    });

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the email', err);

    return new Error('signup email not sent');
  }
}
