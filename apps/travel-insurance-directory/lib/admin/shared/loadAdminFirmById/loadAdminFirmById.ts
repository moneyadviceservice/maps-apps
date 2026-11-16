import { getFirmById } from 'lib/firms/fetchFirm';
import { isMainFirm, isTradingFirm } from 'lib/firms/firmDocument';
import type { IronSessionObject } from 'types/iron-session';
import type {
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type AdminFirmRequestContext = {
  firm: TravelInsuranceFirmDocument;
  mainFirm: MainTravelInsuranceFirmDocument | null;
};

export async function loadAdminFirmById(
  session: IronSessionObject,
  firmId: string,
): Promise<AdminFirmRequestContext | null> {
  const trimmedId = firmId.trim();
  if (!trimmedId) {
    return null;
  }

  const firmResult = await getFirmById(trimmedId);
  if (!firmResult.success || !firmResult.response) {
    return null;
  }

  const firm = firmResult.response;
  let mainFirm: MainTravelInsuranceFirmDocument | null = null;

  if (isTradingFirm(firm)) {
    const mainId = firm.main_firm_id?.trim();
    if (mainId) {
      const mainResult = await getFirmById(mainId);
      const loaded = mainResult.success ? mainResult.response : null;
      mainFirm = loaded && isMainFirm(loaded) ? loaded : null;
    }
  }

  return { firm, mainFirm };
}
