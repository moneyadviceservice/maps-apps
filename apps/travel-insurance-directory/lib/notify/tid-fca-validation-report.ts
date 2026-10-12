import { NotifyClient } from 'notifications-node-client';

export async function tidFcaValidationReport(
  summaryForAdmin: { name: string; frn: number; issue: string }[],
) {
  const notifyApiKey = process.env.NOTIFY_API_KEY;
  const templateIdFcaValidationReport =
    process.env.NOTIFY_TEMPLATE_FCA_VALIDATION_REPORT;
  const adminEmail = process.env.NOTIFY_ADMIN_EMAIL;

  if (!notifyApiKey || !templateIdFcaValidationReport || !adminEmail) {
    const error =
      'Missing env variables (notifyApiKey, templateIdFcaValidationReport, adminEmail) - unable to send email.';
    console.warn(error);

    return new Error(error);
  }

  const notifyClient = new NotifyClient(notifyApiKey);

  const emailContent = summaryForAdmin
    .map(
      (item) =>
        `-----------------------------------------
  Firm: ${item.name} (FRN: ${item.frn})
  Issue: ${item.issue}
  -----------------------------------------`,
    )
    .join('\n');

  console.info('Email content for admin:', emailContent);

  try {
    await notifyClient.sendEmail(templateIdFcaValidationReport, adminEmail, {
      personalisation: {
        emailContent,
      },
    });

    return 'success';
  } catch (err) {
    console.warn('There was an issue sending the email', err);

    return new Error('signup email not sent');
  }
}
