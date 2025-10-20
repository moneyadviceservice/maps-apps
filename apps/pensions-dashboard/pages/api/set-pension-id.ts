import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { logger, updateSessionConfigField } from '../../lib/utils';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Get form data from HTML form submission
  const { pensionId, locale, pensionType } = request.body;

  if (!pensionId) {
    return response.status(400).json({ error: 'pensionId is required' });
  }

  // Set the pensionId in the consolidated session cookie
  const cookies = new Cookies(request, response);
  updateSessionConfigField(cookies, 'pensionID', pensionId);

  // Use provided locale or default to 'en'
  const currentLocale = locale || 'en';

  // Redirect based on pension type
  // State Pension goes to main details page, others go to summary tab
  const redirectPath =
    pensionType === 'SP'
      ? `/${currentLocale}/pension-details`
      : `/${currentLocale}/pension-details/your-pension-summary`;

  logger.log({
    message: 'Setting pension ID in session config cookie',
    url: '/api/set-pension-id',
    data: { pensionId, currentLocale, pensionType, redirectPath },
  });

  response.redirect(302, redirectPath);
}
