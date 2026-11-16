import { getFirmById } from 'lib/firms/fetchFirm';
import { fetchFirmByPrincipalEmail } from 'lib/firms/fetchFirmByPrincipalEmail';
import { isMainFirm } from 'lib/firms/firmDocument';
import type { IronSessionData } from 'iron-session';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

function principalEmailMatchesAccount(
  firm: MainTravelInsuranceFirmDocument,
  accountEmail: string,
): boolean {
  // db_id fallback is only trusted when the firm has no principal email on record.
  const principalEmail = firm.principal?.email_address?.trim().toLowerCase();
  const normalizedAccountEmail = accountEmail.trim().toLowerCase();

  if (!principalEmail) {
    return true;
  }

  return principalEmail === normalizedAccountEmail;
}

export type ResolveAccountMainFirmResult = {
  firm: MainTravelInsuranceFirmDocument | null;
};

/**
 * Resolves the logged-in user's main firm for /account and related APIs.
 *
 * Prefers principal-email lookup (canonical after OTP login). Falls back to
 * session `db_id` for users who dropped off mid-registration, but only when
 * the firm's principal email matches (or is absent).
 */
export async function resolveAccountMainFirm(
  session: Pick<IronSessionData, 'accountEmail' | 'db_id'>,
): Promise<ResolveAccountMainFirmResult> {
  const accountEmail = session.accountEmail?.trim() ?? '';
  if (!accountEmail) {
    return { firm: null };
  }

  const byEmail = await fetchFirmByPrincipalEmail(accountEmail);
  if (byEmail.response && isMainFirm(byEmail.response)) {
    return { firm: byEmail.response };
  }

  if (!session.db_id) {
    return { firm: null };
  }

  const byId = await getFirmById(session.db_id);
  const candidate = byId.response;

  if (!byId.success || !candidate || !isMainFirm(candidate)) {
    return { firm: null };
  }

  if (!principalEmailMatchesAccount(candidate, accountEmail)) {
    return { firm: null };
  }

  return { firm: candidate };
}
