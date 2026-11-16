import { fetchTradingDocsByMainFirmId } from 'lib/account/tradingNames/tradingFirm';
import { getAdminCiFixtureFcaGroup } from 'lib/admin/dashboard/ciFixture/ciFixture';
import { isListedOnPublicDirectory } from 'lib/firms/fcaVisibility';
import { isMainFirm } from 'lib/firms/firmDocument';
import type {
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export async function loadFcaGroupFirms(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Promise<TravelInsuranceFirmDocument[]> {
  const main = isMainFirm(firm) ? firm : mainFirm;
  if (main?.id == null) {
    return [firm];
  }

  if (process.env.CI === 'true') {
    const fixtureGroup = getAdminCiFixtureFcaGroup(main.id);
    if (fixtureGroup.length > 0) {
      return fixtureGroup;
    }
  }

  const tradingResult = await fetchTradingDocsByMainFirmId(main.id);
  const tradingDocs = (tradingResult.response ?? []).filter(
    (doc) => doc.id !== main.id,
  );

  return [main, ...tradingDocs];
}

/** Another group member that is publicly listed. The current firm is excluded. */
export function findOtherListedFirm(
  currentId: string | undefined,
  group: TravelInsuranceFirmDocument[],
): TravelInsuranceFirmDocument | null {
  return (
    group.find(
      (member) => member.id !== currentId && isListedOnPublicDirectory(member),
    ) ?? null
  );
}
