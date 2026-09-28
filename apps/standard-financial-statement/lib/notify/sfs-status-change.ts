import { NotifyClient } from 'notifications-node-client';

export async function sfsStatusChange(
  email: string,
  organisation_name: string,
  emailContent = '',
  additionalEmailContent = '',
  isApproval = false,
  firstName = '',
  membershipNumber = '',
) {
  const notifyApiKey = process.env.SFS_NOTIFY_API_KEY;

  const templateStatusId = process.env.NOTIFY_SFS_STATUS_CHANGE;
  const templateApproveId = process.env.NOTIFY_SFS_APPROVED;

  if (!notifyApiKey || !templateStatusId) {
    console.warn('Missing env variables - unable to send email.');

    return new Error('Missing env variables - unable to send email.');
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  const customAttributes = {
    organisation_name,
    emailContent,
    additionalEmailContent,
  };

  const customAttributeApproval = {
    first_name: firstName,
    membership_number: membershipNumber,
  };

  const payload = isApproval
    ? { ...customAttributeApproval }
    : { ...customAttributes };

  try {
    await notifyClient.sendEmail(
      isApproval ? templateApproveId : templateStatusId,
      email,
      {
        personalisation: payload,
        emailReplyToId: process.env.NOTIFY_SFS_REPLY_TO,
      },
    );

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the email', err);

    return new Error('Status change email not sent');
  }
}
