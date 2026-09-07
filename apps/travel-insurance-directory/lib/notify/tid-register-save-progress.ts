import { NotifyClient } from 'notifications-node-client';

export async function tidSaveProgress(
  emailAddress: string,
  savedProgressLink: string,
  firstName: string,
) {
  const notifyApiKey = process.env.NOTIFY_API_KEY;
  const templateIdRegisterSave = process.env.NOTIFY_TEMPLATE_REGISTER_SAVE;

  if (!notifyApiKey || !templateIdRegisterSave) {
    const error =
      'Missing variables (notifyApiKey, templateIdRegisterSave) - unable to send email.';
    console.warn(error);

    return new Error(error);
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  try {
    await notifyClient.sendEmail(templateIdRegisterSave, emailAddress, {
      personalisation: {
        first_name: firstName,
        saved_progress_link: `[${savedProgressLink}](${savedProgressLink})`,
      },
    });

    return 'success';
  } catch (err) {
    console.warn('An issue occurred while sending the email:', err);

    throw new Error('Save progress email not sent');
  }
}
