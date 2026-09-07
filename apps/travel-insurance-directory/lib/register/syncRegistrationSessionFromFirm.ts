import type { IronSessionData } from 'iron-session';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import type { FcaObject } from 'types/register';

function fcaDataFromFirm(firm: MainTravelInsuranceFirmDocument): FcaObject {
  return {
    frnNumber: String(firm.fca_number ?? ''),
    firmName: firm.registered_name ?? '',
  };
}

function isFcaDataStale(
  existing: FcaObject | undefined,
  fromFirm: FcaObject,
): boolean {
  if (!existing) return true;
  return (
    existing.frnNumber !== fromFirm.frnNumber ||
    existing.firmName !== fromFirm.firmName
  );
}

/**
 * Aligns iron-session with registration flow fields so register APIs can patch Cosmos.
 * Returns true when session was mutated (caller should session.save()).
 */
export function syncRegistrationSessionFromFirm(
  session: IronSessionData,
  firm: MainTravelInsuranceFirmDocument,
): boolean {
  let changed = false;

  if (firm.id && session.db_id !== firm.id) {
    session.db_id = firm.id;
    changed = true;
  }

  const fcaData = fcaDataFromFirm(firm);
  if (isFcaDataStale(session.fcaData, fcaData)) {
    session.fcaData = fcaData;
    changed = true;
  }

  const accountEmail = session.accountEmail?.trim();
  if (accountEmail && !session.userData?.mail) {
    session.userData = { ...session.userData, mail: accountEmail };
    changed = true;
  }

  return changed;
}
