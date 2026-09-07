import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { confirmDetailsPage } from 'data/pages/account/firm-details/confirm-details';
import { isCustomerContactComplete } from 'lib/account/firmSectionStatus';
import {
  buildPromoteCustomerContactConfirmPatch,
  mergeFirmWithSelfServeEditDraft,
} from 'lib/account/selfServeEditDraft';
import {
  persistFirmOrRespond,
  requireFirmIdFromBody,
  resolveFirmOrRespond404,
} from 'lib/account/tripCover/shared/api';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat/errorFormat';
import { respond } from 'utils/api/respond/respond';

const nextPath = confirmDetailsPage.nextStep;

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
    if (!isCustomerContactComplete(viewFirm)) {
      return respond(req, res, {
        status: 400,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: `${confirmDetailsPage.currentRoute}/${firmId}`,
      });
    }

    const confirmedAt = new Date().toISOString();
    const patch = buildPromoteCustomerContactConfirmPatch(
      resolved.firm,
      confirmedAt,
    );
    const saved = await persistFirmOrRespond(
      req,
      res,
      firmId,
      patch,
      `${confirmDetailsPage.currentRoute}/${firmId}`,
    );
    if (!saved) {
      return;
    }

    return respond(req, res, {
      data: { success: true, nextPath },
      redirect: nextPath,
    });
  } catch (error) {
    console.error(error);
    return respond(req, res, {
      status: 500,
      data: { error: 'Internal Server Error' },
      redirect: confirmDetailsPage.currentRoute,
    });
  }
};

export default withAccountSession(handler);
