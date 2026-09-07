import { applyFirmUpdatesToSession } from 'lib/ci/applyFirmUpdatesToSession';
import { IronSessionObject } from 'types/iron-session';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

type Props = {
  session: IronSessionObject;
  updates?: Partial<TravelInsuranceFirmDocument> | Record<string, unknown>;
};

export const mockSaveRegisterProgress = async ({ session, updates }: Props) => {
  return applyFirmUpdatesToSession(session, updates ?? {});
};
