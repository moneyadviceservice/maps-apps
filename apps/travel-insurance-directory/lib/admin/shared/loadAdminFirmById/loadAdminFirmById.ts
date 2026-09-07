import { getAdminCiFixtureMainByFca } from 'lib/admin/dashboard/ciFixture/ciFixture';
import { fetchMainFirmByFcaNumber } from 'lib/admin/shared/fetchMainFirmByFcaNumber/fetchMainFirmByFcaNumber';
import { getFirmById } from 'lib/firms/fetchFirm';
import { isTradingFirm } from 'lib/firms/firmDocument';
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
    if (process.env.CI === 'true') {
      mainFirm = getAdminCiFixtureMainByFca(firm.fca_number);
    } else {
      const mainResult = await fetchMainFirmByFcaNumber(firm.fca_number);
      mainFirm = mainResult.response ?? null;
    }
  }

  return { firm, mainFirm };
}
