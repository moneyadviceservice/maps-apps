import { createFirm } from 'lib/firms/createFirm';
import { getFirmById } from 'lib/firms/fetchFirm';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { mockSaveRegisterProgress } from './mockSaveRegisterProgress';

type Props = {
  session: IronSessionObject;
  updates?: Partial<TravelInsuranceFirmDocument> | Record<string, unknown>;
  /** Used when creating a firm if session.userData.mail is missing (e.g. OTP body). */
  emailFallback?: string;
};

const MISSING_FIRM_ID_ERROR =
  'No firm ID found in session. Complete account sign-in before continuing registration.';

function isRenewalPersistUpdate(
  updates: Partial<TravelInsuranceFirmDocument> | Record<string, unknown>,
): boolean {
  return Object.keys(updates).some(
    (key) =>
      key === 'renewal_resume_href' ||
      key === 'renewal_draft' ||
      key.startsWith('renewal_draft/') ||
      key.startsWith('renewal_draft.'),
  );
}

async function clearStaleDbIdIfFrnMismatch(
  session: IronSessionObject,
): Promise<void> {
  if (!session.db_id || !session.fcaData?.frnNumber) {
    return;
  }

  const firmResult = await getFirmById(session.db_id);
  const firm = firmResult.response;

  if (
    !firmResult.success ||
    !firm ||
    String(firm.fca_number) !== String(session.fcaData.frnNumber)
  ) {
    session.db_id = undefined;
  }
}

function buildPrincipalFromSession(
  session: IronSessionObject,
  emailFallback?: string,
) {
  const email = session.userData?.mail ?? emailFallback;
  if (!email) {
    return undefined;
  }

  return {
    first_name: session.userData?.givenName ?? '',
    last_name: session.userData?.surname ?? '',
    job_title: session.userData?.jobTitle ?? null,
    email_address: email,
    telephone_number: session.userData?.phone ?? null,
    individual_reference_number:
      session.userData?.individualReferenceNumber ?? '',
  };
}

export const saveRegisterProgress = async ({
  session,
  updates,
  emailFallback,
}: Props) => {
  if (process.env.CI === 'true') {
    /**
     * Call mock function instead of creating database bloat during e2e test runs,
     * this lets playwright handle the test scenario without polluting the cosmos DB)
     *
     * Pending re-registration writes go to Cosmos only — stashing renewal_draft in
     * the iron-session cookie exceeds browser cookie size limits.
     */
    if (session.db_id && updates && isRenewalPersistUpdate(updates)) {
      return await updateFirm(session.db_id, updates);
    }
    return mockSaveRegisterProgress({ session, updates });
  }

  await clearStaleDbIdIfFrnMismatch(session);

  if (updates) {
    if (!session.db_id) {
      return { success: false, error: MISSING_FIRM_ID_ERROR };
    }
    return await updateFirm(session.db_id, updates);
  }

  if (session.db_id) {
    return { success: true };
  }

  if (session.fcaData) {
    const principal = buildPrincipalFromSession(session, emailFallback);

    const newFirm = await createFirm({ ...session.fcaData, principal });

    if (newFirm.response) {
      session.db_id = newFirm.response.id;
      await session.save();
    }

    return newFirm;
  }

  return { error: 'Error saving registration progress.' };
};
