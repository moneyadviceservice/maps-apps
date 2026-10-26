import { NotifyClient } from 'notifications-node-client';

function buildSelfServeLandingUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, '')}/account`;
}

export async function tidReregistration(
  firstName: string,
  emailAddress: string,
) {
  const notifyApiKey = process.env.NOTIFY_API_KEY;
  const templateIdReregistration = process.env.NOTIFY_TEMPLATE_REREGISTRATION;
  const baseUrl = process.env.BASE_URL;

  if (!notifyApiKey || !templateIdReregistration || !baseUrl) {
    const error =
      'Missing env variables (notifyApiKey, templateIdReregistration, baseUrl) - unable to send email.';
    console.warn(error);

    return new Error(error);
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  try {
    await notifyClient.sendEmail(templateIdReregistration, emailAddress, {
      personalisation: {
        first_name: firstName,
        self_serve_url: buildSelfServeLandingUrl(baseUrl),
      },
    });

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the re-registration email', err);

    return new Error('re-registration email not sent');
  }
}
