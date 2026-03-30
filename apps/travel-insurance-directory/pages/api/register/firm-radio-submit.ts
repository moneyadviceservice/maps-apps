import { NextApiRequest, NextApiResponse } from 'next';

import { tidRegisterUnsuccessful } from 'lib/notify/tid-register-unsuccessful';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { withIronSession } from 'lib/sessions/withIronSession';
import { errorFormat } from 'utils/api/errorFormat';
import { getNextStepPath } from 'utils/api/getNextStepPath';
import { unsuccessfulPath } from 'utils/api/getNextStepPath/getNextStepPath';
import { respond } from 'utils/api/respond';
import { saveRegisterProgress } from 'utils/api/saveRegisterProgress';

export default withIronSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { field, currentPath, currentStep } = req.body;
  const isChangeAnswer = req.query.isChangeAnswer === 'true';

  const value = req.body?.[field];

  const nextPath = getNextStepPath(
    currentPath,
    currentStep,
    value,
    isChangeAnswer,
  );

  try {
    if (!value) {
      console.error('No form data was received');

      return respond(req, res, {
        status: 400,
        data: errorFormat({ [field]: { error: 'required' } }),
        redirect: currentPath,
      });
    }

    const updateRecord =
      currentPath === '/register/firm'
        ? { [field]: value }
        : { [`medical_coverage/specific_conditions/${field}`]: value };

    await saveRegisterProgress({
      session: req.session,
      updates: updateRecord,
    });

    if (nextPath === unsuccessfulPath) {
      const email = req.session.userData?.mail ?? '';
      const firstName = req.session.userData?.givenName ?? '';
      const lastName = req.session.userData?.surname ?? '';
      const fcaNo = req.session.fcaData?.frnNumber ?? '';
      await tidRegisterUnsuccessful(firstName, lastName, fcaNo, email);
    }

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
