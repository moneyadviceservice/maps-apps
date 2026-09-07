import { NextApiRequest, NextApiResponse } from 'next';

import {
  getAnsweredMedicalConditionsCount,
  isRegistrationPreApproved,
  REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT,
} from 'lib/account/registrationCompletion';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { tidRegisterSuccess } from 'lib/notify/tid-register-success';
import { tidRegisterUnsuccessful } from 'lib/notify/tid-register-unsuccessful';
import { completeConfirmRegistration } from 'lib/register/completeConfirmRegistration';
import { resolveRegisterFirm } from 'lib/register/resolveRegisterFirm';
import { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';

export default withAccountSession(async function handler(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) {
  const { field } = req.body;

  const session = req.session;

  try {
    const firm = session?.db_id ? await resolveRegisterFirm(session) : null;

    if (!firm) {
      return respond(req, res, {
        status: 400,
        data: errorFormat({ ['general']: { error: 'required' } }),
        redirect: '/register/confirm-details?error=missing_fields',
      });
    }

    const answeredCount = getAnsweredMedicalConditionsCount(firm);

    if (answeredCount < REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT) {
      return respond(req, res, {
        status: 400,
        data: errorFormat({ ['general']: { error: 'required' } }),
        redirect: '/register/confirm-details?error=missing_fields',
      });
    }

    const isPreApproved = isRegistrationPreApproved(firm);

    const email = req.session.userData?.mail ?? '';
    const firstName = req.session.userData?.givenName ?? '';
    if (!isPreApproved) {
      const lastName = req.session.userData?.surname ?? '';
      const fcaNo = req.session.fcaData?.frnNumber ?? '';
      await tidRegisterUnsuccessful(firstName, lastName, fcaNo, email);

      return respond(req, res, {
        data: { success: true, nextPath: '/register/unsuccessful' },
        redirect: '/register/unsuccessful',
      });
    }

    const outcome = await completeConfirmRegistration(firm);
    if (!outcome.success) {
      return respond(req, res, {
        status: 500,
        data: errorFormat({ [field]: { error: 'general_error' } }),
        redirect: '/register/confirm-details',
      });
    }

    await tidRegisterSuccess(firstName, email);
    return respond(req, res, {
      data: { success: true, nextPath: '/register/success' },
      redirect: '/register/success',
    });
  } catch (err) {
    console.error('Error in firm radio submit handler:', err);

    return respond(req, res, {
      status: 500,
      data: errorFormat({ [field]: { error: 'general_error' } }),
      redirect: '/register/confirm-details',
    });
  }
});
