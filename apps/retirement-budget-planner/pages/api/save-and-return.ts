import { NextApiRequest, NextApiResponse } from 'next';

import { getSessionId } from 'lib/util/get-session-id';
import { validateEmails } from 'lib/validation/emailValidation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const data = req.body || req.query;
    const { email1, email2 } = data;

    const sessionId = getSessionId(req.body.sessionId || req.query.sessionId);

    const { search, pathname } = new URL(req.headers.referer || '');
    const params = new URLSearchParams(search);

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const error = validateEmails(email1, email2);
    if (error) {
      res.redirect(
        303,
        `${pathname}?${params.toString()}&error=${true.toString()}&email1=${email1}&email2=${email2}`,
      );
    }
    res.status(200).json({ message: 'Email saved and link sent' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
