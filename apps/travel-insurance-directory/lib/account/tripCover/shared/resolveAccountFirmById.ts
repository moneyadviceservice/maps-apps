import { resolveAccountMainFirm } from 'lib/account/resolveAccountMainFirm';
import {
  type AccountTradingNameRouteContext,
  tradingDocOwnedByMain,
} from 'lib/account/resolveAccountTradingNameRequest';
import { getFirmById } from 'lib/firms/fetchFirm';
import type { IronSessionObject } from 'types/iron-session';
import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export type ResolvedAccountFirm = {
  firm: TravelInsuranceFirmDocument;
  isTrading: boolean;
};

export async function resolveAccountFirmById(
  session: IronSessionObject,
  firmId: string,
): Promise<ResolvedAccountFirm | null> {
  const { firm: principalFirm } = await resolveAccountMainFirm(session);
  if (!principalFirm?.id) {
    return null;
  }

  const ctx: AccountTradingNameRouteContext = {
    firm: principalFirm,
    firmId: principalFirm.id,
    mainFrn: principalFirm.fca_number,
  };

  if (firmId === principalFirm.id) {
    return { firm: principalFirm, isTrading: false };
  }

  const targetResult = await getFirmById(firmId);
  const targetFirm = targetResult.response;
  if (!targetResult.success || !targetFirm) {
    return null;
  }

  if (targetFirm.type === 'trading' && tradingDocOwnedByMain(targetFirm, ctx)) {
    return { firm: targetFirm, isTrading: true };
  }

  return null;
}
