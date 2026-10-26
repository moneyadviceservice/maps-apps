import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { isAllowedChangeTargetPath } from 'lib/account/tripCover/confirm';
import {
  handleTripCoverApiError,
  resolveFirmOrRespond404,
} from 'lib/account/tripCover/shared/api';
import { confirmPath } from 'lib/account/tripCover/steps';
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
  const firmId = (req.body?.firmId ?? '').toString().trim();
  const targetPath = (req.body?.targetPath ?? '').toString().trim();

  try {
    if (!firmId || !targetPath) {
      return res
        .status(400)
        .json({ error: 'firmId and targetPath are required' });
    }

    const resolved = await resolveFirmOrRespond404(req, res, session, firmId);
    if (!resolved) {
      return;
    }

    if (!isAllowedChangeTargetPath(firmId, targetPath)) {
      return respond(req, res, {
        status: 400,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: confirmPath(firmId),
      });
    }

    const nextPage = `${targetPath}${
      targetPath.includes('?') ? '&' : '?'
    }change=true`;

    return respond(req, res, {
      data: { success: true, nextPath: nextPage },
      redirect: nextPage,
    });
  } catch (error) {
    return handleTripCoverApiError(
      req,
      res,
      error,
      firmId ? confirmPath(firmId) : '/account',
    );
  }
};

export default withAccountSession(handler);
