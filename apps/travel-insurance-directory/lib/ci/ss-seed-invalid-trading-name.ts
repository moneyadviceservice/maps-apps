import {
  buildTradingFirmPayload,
  createTradingFirm,
} from 'lib/account/tradingFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared';
import { selfServeE2eConstants } from 'lib/ci/selfServeE2eConstants';
import { isMainFirm } from 'lib/firms/firmDocument';
import type { IronSessionObject } from 'types/iron-session';

/**
 * Seeds a linked trading firm with an FCA visibility block.
 * CI-only. Assumes reset has already wiped existing trading docs.
 */
export const seedInvalidTradingNameForSS = async (
  session: IronSessionObject,
  hiddenReason: string,
) => {
  if (process.env.CI !== 'true') {
    console.error('Unauthorized attempt to seed invalid trading name data');
    return { error: 'Unauthorized', success: false };
  }

  const firmId = session.db_id;
  if (!firmId) {
    return { error: 'Could not resolve session with firm ID', success: false };
  }

  const resolved = await resolveAccountFirmById(session, firmId);
  if (!resolved || !isMainFirm(resolved.firm)) {
    return { error: 'Could not resolve session with firm ID', success: false };
  }

  const created = await createTradingFirm({
    ...buildTradingFirmPayload({
      name: selfServeE2eConstants.tradingNames[0],
      mainFrn: resolved.firm.fca_number,
      mainFirmId: firmId,
    }),
    hidden_reason: hiddenReason,
  });

  if (!created.success) {
    return {
      error: 'A problem occurred seeding invalid trading name state',
      success: false,
    };
  }

  return { success: true, firm: created.response };
};
