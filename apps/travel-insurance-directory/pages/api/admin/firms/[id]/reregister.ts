import type { NextApiResponse } from 'next';

import { applyFirmReregistration } from 'lib/admin/detail/reregistration/reregistration';
import {
  ensurePostMethodAndAdminSession,
  getFirmIdFromAdminRequest,
  redirectToAdminFirmDetail,
  withAdminFirmApiSession,
} from 'lib/admin/detail/api/adminFirmRequest/adminFirmRequest';
import { loadAdminFirmById } from 'lib/admin/shared/loadAdminFirmById/loadAdminFirmById';

import type { NextApiRequestWithSession } from '@maps-react/entra-id/auth-msal';

export default withAdminFirmApiSession(async function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) {
  if (!ensurePostMethodAndAdminSession(req, res)) {
    return;
  }

  const firmId = getFirmIdFromAdminRequest(req);
  if (!firmId) {
    res.status(400).json({ error: 'Firm id is required' });
    return;
  }

  const ctx = await loadAdminFirmById(req.session, firmId);
  if (!ctx) {
    res.status(404).json({ error: 'Firm not found' });
    return;
  }

  const result = await applyFirmReregistration(ctx.firm);

  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  redirectToAdminFirmDetail(res, firmId);
});
