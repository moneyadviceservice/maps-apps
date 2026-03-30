import { NextApiRequest, NextApiResponse } from 'next';

import { fetchFirm } from 'lib/firms/fetchFirm';
import { tidRegisterSuccess } from 'lib/notify/tid-register-success';
import { tidRegisterUnsuccessful } from 'lib/notify/tid-register-unsuccessful';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { withIronSession } from 'lib/sessions/withIronSession';
import { SpecificConditions } from 'types/travel-insurance-firm';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';

export default withIronSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { field } = req.body;

  const sessionId = req.session.db_id;
  let data = null;

  try {
    if (sessionId) {
      const firmData = await fetchFirm(sessionId);
      if (firmData.response) {
        data = firmData.response?.medical_coverage?.specific_conditions;
      }
    }

    const hasHighRiskConditions = (
      conditions: SpecificConditions | null | undefined,
    ) => {
      if (!conditions) return false;

      return (
        Object.values(conditions).filter((val) => val === 'true').length >= 15
      );
    };

    const isPreApproved = hasHighRiskConditions(data);

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
},
registerSessionOptions);
