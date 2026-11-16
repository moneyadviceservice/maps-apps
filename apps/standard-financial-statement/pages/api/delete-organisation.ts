import type { NextApiRequest, NextApiResponse } from 'next';

import { deleteOrganisation } from '../../lib/organisations/deleteOrganisation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed. Use DELETE.' });
  }

  const { licence_number } = JSON.parse(req.body);

  if (!licence_number) {
    return res.status(400).json({
      error: 'Missing or invalid field: licence_number is required',
    });
  }

  try {
    const result = await deleteOrganisation(licence_number);

    if ('error' in result) {
      return res.status(404).json(result);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Delete failed', err);
    return res.status(500).json({ error: 'Failed to delete organisation' });
  }
}
