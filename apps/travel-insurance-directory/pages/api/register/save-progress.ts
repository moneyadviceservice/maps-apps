import { NextApiRequest, NextApiResponse } from 'next';

import { hasActivePendingReregistration } from 'lib/account/reregistrationState';
import { resolveAccountMainFirm } from 'lib/account/resolveAccountMainFirm';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { tidSaveProgress } from 'lib/notify/tid-register-save-progress';
import {
  SAVE_PROGRESS_PATH,
  SAVE_PROGRESS_SUCCESS_PATH,
} from 'types/CONSTANTS';
import { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';

export default withAccountSession(async function handler(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) {
  const session = req.session;

  try {
    const email = session.userData?.mail ?? '';
    const firstName = session.userData?.givenName ?? '';

    let savedProgressPath = session.savedProgressLink ?? '';

    const { firm } = await resolveAccountMainFirm(session);
    if (
      firm &&
      hasActivePendingReregistration(firm) &&
      firm.renewal_resume_href
    ) {
      savedProgressPath = firm.renewal_resume_href;
    }

    const baseUrl = req.headers.origin || `http://${req.headers.host}`;
    const savedProgressLink = `${baseUrl}${savedProgressPath}`;
    const result = await tidSaveProgress(email, savedProgressLink, firstName);

    if (result !== 'success') {
      throw new Error(result.message);
    }

    return respond(req, res, {
      data: { success: true, nextPath: SAVE_PROGRESS_SUCCESS_PATH },
      redirect: SAVE_PROGRESS_SUCCESS_PATH,
    });
  } catch (err) {
    console.error('Error in save-progress handler:', err);

    return respond(req, res, {
      status: 500,
      data: errorFormat({ ['apiError']: { error: 'general_error' } }),
      redirect: `${SAVE_PROGRESS_PATH}?error=apiError`,
    });
  }
});
