import type { NextApiRequest, NextApiResponse } from 'next';
import { NotifyClient } from 'notifications-node-client';

const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    body: { language, email },
    headers: { referer },
  } = request;

  const { search, pathname } = new URL(referer ?? '');
  const params = new URLSearchParams(search);
  const BASE_URL = `/${language}/${process.env.appUrl}`;
  const validateEmail = (email: string) => {
    // email validation regex adapted from https://regex101.com/r/SOgUIV/2 with duplicates removed
    return /^((?!\.)[\w\-.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.])$/.exec(
      email.toLowerCase(),
    );
  };

  if (!validateEmail(email)) {
    // if email is invalid, return user to same page, with error param added if email is incorrect.
    params.set('error', 'email');
    response.redirect(302, `${pathname}?${params.toString()}`);
  } else {
    // email is valid, clear error, don't display language, set returning param
    params.delete('error');
    params.delete('language');
    params.set('returning', 'true');
    const saveReturnLink = `${request.headers.origin}${BASE_URL}${
      params.get('complete') ? '/summary' : ''
    }?${params.toString()}`;
    const templateId =
      language === 'cy'
        ? process.env.NOTIFY_TEMPLATE_ID_CY
        : process.env.NOTIFY_TEMPLATE_ID;

    // send email to gov.notify
    notifyClient
      .sendEmail(templateId, email, {
        personalisation: {
          save_return_link: saveReturnLink,
        },
        reference: null,
      })
      .then(() => {
        // send to success page
        params.delete('returning');
        const hasParams = !!params.toString();
        response.redirect(
          302,
          `${BASE_URL}/progress-saved${
            hasParams ? `?${params.toString()}` : ''
          }`,
        );
      })
      .catch(() => {
        // return to page with error
        params.delete('returning');
        params.set('error', 'true');
        response.redirect(302, `${pathname}?${params.toString()}`);
      });
  }
}
