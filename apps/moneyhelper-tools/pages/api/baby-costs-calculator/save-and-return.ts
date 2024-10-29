import type { NextApiRequest, NextApiResponse } from 'next';
import { NotifyClient } from 'notifications-node-client';
import { validateEmail } from 'utils/validateEmail';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

const notifyClient = new NotifyClient(process.env.MH_NOTIFY_API_KEY);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    body: { language, email, savedData, isEmbed, tab, toolBaseUrl },
  } = request;

  const savedDataParsed = savedData ? JSON.parse(savedData) : {};
  const isEmbedBool = isEmbed === 'true';

  const query = new URLSearchParams({
    ...savedDataParsed,
    ...(tab && { tab: tab }),
  });

  if (!validateEmail(email)) {
    query.set('error', 'email');
  } else {
    query.set('returning', 'true');
    const returnUrl = `${toolBaseUrl}${tab}?${query.toString()}`;
    query.delete('returning');
    const saveReturnLink = `[${
      language === 'cy'
        ? 'Ail-ddechrau Cyfrifiannell Costau Babi'
        : 'Resume Baby Cost Calculator'
    }](${request.headers.origin}${returnUrl})`;

    const templateId =
      language === 'cy'
        ? process.env.NOTIFY_BABY_COST_ID_CY
        : process.env.NOTIFY_BABY_COST_ID;

    await notifyClient
      .sendEmail(templateId, email, {
        personalisation: {
          save_return_link: saveReturnLink,
        },
        reference: null,
      })
      .then(() => {
        query.set('saved', 'true');
      })
      .catch(() => {
        query.set('error', 'save-api');
      });
  }
  response.redirect(
    302,
    `${toolBaseUrl}save?${query.toString()}${addEmbedQuery(isEmbedBool, '&')}`,
  );
}
