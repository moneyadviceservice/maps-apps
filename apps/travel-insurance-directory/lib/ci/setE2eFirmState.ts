import {
  deleteTradingFirmDocument,
  fetchTradingDocsByMainFirmId,
} from 'lib/account/tradingFirm';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export const setE2eFirmState = async (
  session: IronSessionObject,
  firmUpdateObject: Partial<TravelInsuranceFirmDocument>,
) => {
  if (process.env.CI !== 'true') {
    console.error('Unauthorized attempt to reset ss data');
    return { error: 'Unauthorized', success: false };
  }

  const firmId = session.db_id;
  const resolved = await resolveAccountFirmById(session, firmId);

  if (!resolved) {
    return { error: 'Could not resolve session with firm ID', success: false };
  }

  const updateResult = await updateFirm(firmId, firmUpdateObject);

  if (!updateResult.success) {
    return {
      error: 'A problem occurred updating the firm record',
      success: false,
    };
  }

  const tradingResult = await fetchTradingDocsByMainFirmId(firmId);
  if (!tradingResult.success) {
    return {
      error: 'Failed to fetch trading firm documents for reset',
      success: false,
    };
  }

  for (const doc of tradingResult.response ?? []) {
    const deleteResult = await deleteTradingFirmDocument(doc);
    if (!deleteResult.success) {
      return {
        error: 'Failed to delete trading firm documents during reset',
        success: false,
      };
    }
  }

  return { success: true };
};
