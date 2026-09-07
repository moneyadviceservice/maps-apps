import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  buildPromoteCoverServiceConfirmPatch,
  mergeFirmWithSelfServeEditDraft,
} from 'lib/account/selfServeEditDraft';
import {
  handleTripCoverApiError,
  persistFirmOrRespond,
  requireFirmIdFromBody,
  resolveFirmOrRespond404,
} from 'lib/account/tripCover/shared/api';
import {
  confirmPath,
  getSelfServeRedirectIfIncomplete,
} from 'lib/account/tripCover/steps';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat/errorFormat';
import { respond } from 'utils/api/respond/respond';

const handler: NextApiHandler = async (
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') return res.status(405).end();

  const session = req.session;

  try {
    const firmId = requireFirmIdFromBody(req, res);
    if (!firmId) {
      return;
    }

    const resolved = await resolveFirmOrRespond404(req, res, session, firmId);
    if (!resolved) {
      return;
    }

    const viewFirm = mergeFirmWithSelfServeEditDraft(resolved.firm);
    const incompleteRedirect = getSelfServeRedirectIfIncomplete(
      firmId,
      viewFirm,
      { page: 'confirm-api' },
    );

    if (incompleteRedirect) {
      return respond(req, res, {
        status: 400,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: incompleteRedirect,
      });
    }

    const confirmedAt = new Date().toISOString();
    const patch = buildPromoteCoverServiceConfirmPatch(
      resolved.firm,
      confirmedAt,
    );
    const saved = await persistFirmOrRespond(
      req,
      res,
      firmId,
      patch,
      confirmPath(firmId),
    );
    if (!saved) {
      return;
    }

    const nextPath = '/account';

    return respond(req, res, {
      data: { success: true, nextPath },
      redirect: nextPath,
    });
  } catch (error) {
    const firmId = (req.body?.firmId ?? '').toString().trim();
    return handleTripCoverApiError(
      req,
      res,
      error,
      firmId ? confirmPath(firmId) : '/account',
    );
  }
};

export default withAccountSession(handler);
