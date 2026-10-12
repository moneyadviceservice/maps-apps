import type { IronSessionData } from 'iron-session';
import { getFirmById, getSessionFirm } from 'lib/firms/fetchFirm';
import { isMainFirm } from 'lib/firms/firmDocument';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

type RegisterFirmSession = Pick<IronSessionData, 'db_id' | 'firmData'>;

function asMainFirm(
  firm: ReturnType<typeof getSessionFirm>['response'],
): MainTravelInsuranceFirmDocument | null {
  if (firm && isMainFirm(firm)) {
    return firm;
  }
  return null;
}

/**
 * Main firm for /register.
 * CI + firmData → session mock; otherwise Cosmos/fixture by db_id.
 */
export async function resolveRegisterFirm(
  session: RegisterFirmSession,
): Promise<MainTravelInsuranceFirmDocument | null> {
  if (session.db_id) {
    const useSessionMock =
      process.env.CI === 'true' && session.firmData != null;

    if (useSessionMock) {
      const fromSession = asMainFirm(
        getSessionFirm(session, session.db_id).response,
      );
      if (fromSession) {
        return fromSession;
      }
    } else {
      const byId = await getFirmById(session.db_id);
      const fromCosmos = asMainFirm(byId.response);
      if (fromCosmos) {
        return fromCosmos;
      }
    }
  }

  return asMainFirm(getSessionFirm(session).response);
}
