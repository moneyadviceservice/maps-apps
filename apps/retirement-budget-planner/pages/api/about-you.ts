import { NextApiRequest, NextApiResponse } from 'next';

import {
  convertFormData,
  filterFirstPartner,
  findPartnerById,
  PARTNER2,
  partners,
  updatePartners,
} from 'lib/util/about-you';

import { setPartnersInRedis } from './set-partner-details';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let updatedPartners = partners;
  const sessionId = req.cookies?.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is missing' });
  }

  if (req.method === 'POST') {
    const data = req.body || req.query;
    const { id } = req.query;

    updatedPartners = convertFormData(data);
    const action = data.action;
    if (action === 'update') {
      updatePartners(updatedPartners);
    }
    if (action === 'edit') {
      updatePartners(updatedPartners);
      await setPartnersInRedis(updatedPartners, sessionId);

      res.writeHead(302, {
        location: `/en/about-you?edit=1&id=${id}`,
      });
      return res.end();
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

    res.writeHead(302, { location: `/en/about-you` });
    return res.end();
  }
  res.status(405).json({ message: 'Method not allowed' });
}
