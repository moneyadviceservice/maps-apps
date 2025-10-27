import type { NextApiRequest, NextApiResponse } from 'next';

import { updateOrganisation } from '../../lib/organisations/updateOrganisation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed. Use PUT.' });
    }

    const body = req.body;

    if (!body?.licence_number) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: licence_number' });
    }

    const result = await updateOrganisation(body);

    if ('error' in result) {
      return res.status(404).json(result);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Export failed', err);
    res.status(500).json({ error: 'Failed to export organisations' });
  }
}
