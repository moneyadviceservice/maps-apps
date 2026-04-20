import { NextApiRequest, NextApiResponse } from 'next';

import { tidSaveProgress } from 'lib/notify/tid-register-save-progress';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { withIronSession } from 'lib/sessions/withIronSession';
import {
  SAVE_PROGRESS_PATH,
  SAVE_PROGRESS_SUCCESS_PATH,
} from 'types/CONSTANTS';
import { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';

export default withIronSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = req.session as IronSessionObject;

  try {
    const email = session.userData?.mail ?? '';
    const savedProgressPath = session.savedProgressLink ?? '';
    const firstName = session.userData?.givenName ?? '';

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
    console.error('Error in firm radio submit handler:', err);

    return respond(req, res, {
      status: 500,
      data: errorFormat({ ['apiError']: { error: 'general_error' } }),
      redirect: `${SAVE_PROGRESS_PATH}?error=apiError`,
    });
  }
},
registerSessionOptions);
