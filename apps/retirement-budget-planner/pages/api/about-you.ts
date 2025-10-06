import { NextApiRequest, NextApiResponse } from 'next';

import {
  convertFormData,
  filterFirstPartner,
  findPartnerById,
  PARTNER2,
  partners,
  updatePartners,
} from 'lib/util/about-you';
import { getSessionId } from 'lib/util/get-session-id';

import { setPartnersInRedis } from './set-partner-details';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let updatedPartners = partners;
  const sessionId = getSessionId(req.body.sessionId);
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is missing' });
  }

  if (req.method === 'POST') {
    const data = req.body || req.query;
    const { id } = req.query;

    const queryParams = new URLSearchParams({
      sessionId: sessionId,
    });

    updatedPartners = convertFormData(data);
    const action = data.action;
    if (action === 'update') {
      updatePartners(updatedPartners);
    }
    if (action === 'edit') {
      updatePartners(updatedPartners);
      await setPartnersInRedis(updatedPartners, sessionId);

      queryParams.set('edit', '1');
      queryParams.set('id', id as string);
      res.redirect(303, `/en/about-you?${queryParams.toString()}`);
    }
    if (action === 'add') {
      if (!findPartnerById(updatedPartners, 2)) {
        updatedPartners = [...updatedPartners, PARTNER2];
      }
    }
    if (action === 'remove') {
      updatedPartners = filterFirstPartner(updatedPartners, 2);
    }

    await setPartnersInRedis(updatedPartners, sessionId);
    res.redirect(303, `/en/about-you?${queryParams.toString()}`);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
