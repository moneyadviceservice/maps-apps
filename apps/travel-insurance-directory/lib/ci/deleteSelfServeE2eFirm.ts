import {
  deleteTradingFirmDocument,
  fetchTradingDocsByMainFirmId,
} from 'lib/account/tradingFirm';
import { dbConnect } from 'lib/database/dbConnect';
import { isMainFirm } from 'lib/firms/firmDocument';
import { fetchFirmByPrincipalEmail } from 'lib/firms/fetchFirmByPrincipalEmail';

export type DeleteSelfServeE2eFirmResult = {
  success: boolean;
  error?: string;
  deleted?: boolean;
};

/** Only unique e2e run emails may be cleaned up via this helper. */
export const E2E_SELF_SERVE_EMAIL_PATTERN = /^e2e-user\+.+@test\.com$/i;

/**
 * CI-only: delete the Cosmos main firm for an e2e principal email
 * (and any trading firms linked to it).
 */
export async function deleteSelfServeE2eFirm(
  email: string,
): Promise<DeleteSelfServeE2eFirmResult> {
  if (process.env.CI !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { success: false, error: 'Missing account email' };
  }

  if (!E2E_SELF_SERVE_EMAIL_PATTERN.test(normalized)) {
    return { success: false, error: 'Email is not an e2e self-serve address' };
  }

  const byEmail = await fetchFirmByPrincipalEmail(normalized);
  if (!byEmail.response || !isMainFirm(byEmail.response)) {
    return { success: true, deleted: false };
  }

  const firm = byEmail.response;
  if (!firm.id) {
    return { success: false, error: 'Firm is missing id' };
  }

  const tradingResult = await fetchTradingDocsByMainFirmId(firm.id);
  if (!tradingResult.success) {
    return {
      success: false,
      error: tradingResult.error ?? 'Failed to fetch trading firms',
    };
  }

  for (const doc of tradingResult.response ?? []) {
    const deleteTrading = await deleteTradingFirmDocument(doc);
    if (!deleteTrading.success) {
      return {
        success: false,
        error: deleteTrading.error ?? 'Failed to delete trading firm',
      };
    }
  }

  try {
    const { container } = await dbConnect();
    await container.item(firm.id, firm.id).delete();
    return { success: true, deleted: true };
  } catch (error) {
    console.error('Delete e2e main firm failed:', error);
    return { success: false, error: 'Failed to delete main firm' };
  }
}
