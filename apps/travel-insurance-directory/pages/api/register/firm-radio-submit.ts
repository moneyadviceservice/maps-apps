import { NextApiRequest, NextApiResponse } from 'next';

import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { withIronSession } from 'lib/sessions/withIronSession';
import { errorFormat } from 'utils/api/errorFormat';
import { getNextStepPath } from 'utils/api/getNextStepPath';
import { respond } from 'utils/api/respond';
import { saveRegisterProgress } from 'utils/api/saveRegisterProgress';

export default withIronSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { field, currentPath, currentStep } = req.body;

  const value = req.body?.[field];

  const nextPath = getNextStepPath(currentStep, value);

  try {
    if (!value) {
      console.error('No form data was received');

      return respond(req, res, {
        status: 400,
        data: errorFormat({ [field]: { error: 'required' } }),
        redirect: currentPath,
      });
    }

    const record = { [field]: value };

    await saveRegisterProgress({ session: req.session, updates: record });

    respond(req, res, {
      data: { success: true, nextPath },
      redirect: nextPath,
    });
  } catch (err) {
    console.error('Error in firm radio submit handler:', err);

    return respond(req, res, {
      status: 500,
      data: errorFormat({ [field]: { error: 'general_error' } }),
      redirect: currentPath,
    });
  }
},
registerSessionOptions);
