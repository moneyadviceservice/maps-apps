import type { NextApiRequest, NextApiResponse } from 'next';

import { sfsStatusChange } from '../../lib/notify/sfs-status-change';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const {
    email,
    organisation_name,
    emailContent,
    additionalEmailContent,
    isApproval,
    firstName,
    membershipNumber,
  } = JSON.parse(req.body);

  const response = await sfsStatusChange(
    email,
    organisation_name,
    emailContent,
    additionalEmailContent,
    isApproval,
    firstName,
    membershipNumber,
  );

  if (response === 'success') {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
}
