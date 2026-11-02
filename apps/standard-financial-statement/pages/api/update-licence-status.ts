import type { NextApiRequest, NextApiResponse } from 'next';

import { entraUserStatusInBulk } from 'lib/entra/entraUserStatusInBulk';

import { updateOrganisation } from '../../lib/organisations/updateOrganisation';
import { Action } from '../../types/admin/base';
import { getStatusByAction } from '../../utils/admin/getStatusByAction';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed. Use PUT.' });
  }

  const { licence_number, action, users } = JSON.parse(req.body);
  const accountEnabled = action !== 'decline';

  if (!licence_number || typeof action !== 'string') {
    return res.status(400).json({
      error:
        'Missing or invalid fields: licence_number and licence_status are required',
    });
  }

  const status = getStatusByAction(action as Action);

  try {
    await entraUserStatusInBulk(users, accountEnabled);

    const result = await updateOrganisation({
      licence_number,
      payload: {
        licence_status: status,
      },
    });

    if ('error' in result) {
      return res.status(404).json(result);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Update failed', err);
    return res.status(500).json({ error: 'Failed to update organisation' });
  }
}
