import { NextApiRequest, NextApiResponse } from 'next';

import { hasActivePendingReregistration } from 'lib/account/reregistrationState';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { tidRegisterUnsuccessful } from 'lib/notify/tid-register-unsuccessful';
import {
  buildRegistrationUpdate,
  prefixRegistrationUpdateForRenewalDraft,
} from 'lib/register/registerFieldPaths';
import { resolveRegisterFirm } from 'lib/register/resolveRegisterFirm';
import { SAVE_PROGRESS_PATH } from 'types/CONSTANTS';
import { IronSessionObject } from 'types/iron-session';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { errorFormat } from 'utils/api/errorFormat';
import { getNextStepPath } from 'utils/api/getNextStepPath';
import { unsuccessfulPath } from 'utils/api/getNextStepPath/getNextStepPath';
import { respond } from 'utils/api/respond';
import { saveRegisterProgress } from 'utils/api/saveRegisterProgress';

async function persistPendingRenewalResumeHref(
  session: IronSessionObject,
  savedProgressLink: string,
): Promise<void> {
  if (!session.db_id) {
    return;
  }

  const firm = await resolveRegisterFirm(session);
  if (firm && hasActivePendingReregistration(firm)) {
    await saveRegisterProgress({
      session,
      updates: { renewal_resume_href: savedProgressLink },
    });
  }
}

async function handleSaveProgressOnly(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
  currentPath: string,
  currentStep: string,
) {
  const savedProgressLink = `${currentPath}/${currentStep}`;
  req.session.savedProgressLink = savedProgressLink;

  await persistPendingRenewalResumeHref(req.session, savedProgressLink);
  await req.session.save();

  return respond(req, res, {
    data: { success: true, nextPath: SAVE_PROGRESS_PATH },
    redirect: SAVE_PROGRESS_PATH,
  });
}

function isPendingRenewalFirm(
  firm: MainTravelInsuranceFirmDocument | null | undefined,
): firm is MainTravelInsuranceFirmDocument {
  return Boolean(firm && hasActivePendingReregistration(firm));
}

function buildSubmitUpdateRecord(
  currentPath: string,
  field: string,
  value: string,
  nextPath: string,
  firm: MainTravelInsuranceFirmDocument | null | undefined,
): Record<string, string | boolean> {
  const updateRecord = buildRegistrationUpdate(currentPath, field, value);
  if (!isPendingRenewalFirm(firm)) {
    return updateRecord;
  }

  return {
    ...prefixRegistrationUpdateForRenewalDraft(updateRecord),
    renewal_resume_href: nextPath,
  };
}

async function notifyIfUnsuccessfulPath(
  session: IronSessionObject,
  nextPath: string,
): Promise<void> {
  if (nextPath !== unsuccessfulPath) {
    return;
  }

  const email = session.userData?.mail ?? '';
  const firstName = session.userData?.givenName ?? '';
  const lastName = session.userData?.surname ?? '';
  const fcaNo = session.fcaData?.frnNumber ?? '';
  await tidRegisterUnsuccessful(firstName, lastName, fcaNo, email);
}

export default withAccountSession(async function handler(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) {
  const session = req.session;

  const { field, currentPath, currentStep, action } = req.body;
  const saveProgress = action === 'save';
  const isChangeAnswer = req.query.isChangeAnswer === 'true';
  const value = req.body?.[field];

  if (!value && saveProgress) {
    return handleSaveProgressOnly(req, res, currentPath, currentStep);
  }

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

    if (!session.db_id) {
      return respond(req, res, {
        status: 500,
        data: errorFormat({ [field]: { error: 'general_error' } }),
        redirect: currentPath,
      });
    }

    const firm = await resolveRegisterFirm(session);
    const updateRecord = buildSubmitUpdateRecord(
      currentPath,
      field,
      value,
      nextPath,
      firm,
    );

    const saveResult = await saveRegisterProgress({
      session,
      updates: updateRecord,
    });

    if (saveResult && 'error' in saveResult && saveResult.error) {
      return respond(req, res, {
        status: 500,
        data: errorFormat({ [field]: { error: 'general_error' } }),
        redirect: currentPath,
      });
    }

    await notifyIfUnsuccessfulPath(session, nextPath);

    session.savedProgressLink = nextPath;
    await session.save();

    const nextLink = saveProgress ? SAVE_PROGRESS_PATH : nextPath;

    respond(req, res, {
      data: { success: true, nextPath: nextLink, data: session.firmData },
      redirect: nextLink,
    });
  } catch (err) {
    console.error('Error in firm radio submit handler:', err);

    return respond(req, res, {
      status: 500,
      data: errorFormat({ [field]: { error: 'general_error' } }),
      redirect: currentPath,
    });
  }
});
