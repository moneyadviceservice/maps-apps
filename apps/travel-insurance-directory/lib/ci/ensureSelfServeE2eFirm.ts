import { isMainFirm } from 'lib/firms/firmDocument';
import { createFirm } from 'lib/firms/createFirm';
import { fetchFirmByPrincipalEmail } from 'lib/firms/fetchFirmByPrincipalEmail';
import { syncRegistrationSessionFromFirm } from 'lib/register/syncRegistrationSessionFromFirm';
import type { IronSessionData } from 'iron-session';

import { selfServeE2eConstants } from './selfServeE2eConstants';

export type EnsureSelfServeE2eFirmResult = {
  success: boolean;
  error?: string;
};

/**
 * CI-only: ensure a Cosmos main firm exists for the session account email
 * (fetch by principal email, or create with E2E FRN/name metadata).
 */
export async function ensureSelfServeE2eFirm(
  session: IronSessionData,
): Promise<EnsureSelfServeE2eFirmResult> {
  if (process.env.CI !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  const email = session.accountEmail?.trim();
  if (!email) {
    return { success: false, error: 'Missing account email' };
  }

  const byEmail = await fetchFirmByPrincipalEmail(email);
  if (byEmail.response && isMainFirm(byEmail.response)) {
    syncRegistrationSessionFromFirm(session, byEmail.response);
    return { success: true };
  }

  const created = await createFirm({
    frnNumber: selfServeE2eConstants.fcaNumberString,
    firmName: selfServeE2eConstants.registeredName,
    principal: {
      first_name: 'E2E',
      last_name: 'User',
      email_address: email,
      individual_reference_number: 'E2E000',
    },
  });

  if (!created.success || !created.response || !isMainFirm(created.response)) {
    return {
      success: false,
      error: created.error ?? 'Failed to create e2e firm',
    };
  }

  syncRegistrationSessionFromFirm(session, created.response);
  return { success: true };
}
