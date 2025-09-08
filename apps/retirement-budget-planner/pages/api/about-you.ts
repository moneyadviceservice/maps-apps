import { NextApiRequest, NextApiResponse } from 'next';

import {
  convertFormData,
  filterFirstPartner,
  findPartnerById,
  PARTNER2,
  partners,
  updatePartners,
} from 'lib/util/about-you';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let updatedPartners = partners;
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
      const queryString = encodeURIComponent(JSON.stringify(updatedPartners));

      res.writeHead(302, {
        location: `/en/about-you?edit=1&id=${id}&partners=${queryString}`,
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

    if (req.headers['content-type']?.includes('application/json')) {
      return res.status(200).json({ success: true, updatedPartners });
    }

    const queryString = encodeURIComponent(JSON.stringify(updatedPartners));

    res.writeHead(302, { location: `/en/about-you?partners=${queryString}` });
    return res.end();
  }
  res.status(405).json({ message: 'Method not allowed' });
}
