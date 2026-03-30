import { createFirm } from 'lib/firms/createFirm';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

type Props = {
  session: IronSessionObject;
  updates?: Partial<TravelInsuranceFirmDocument> | Record<string, unknown>;
};

export const saveRegisterProgress = async ({ session, updates }: Props) => {
  const updateExistingFirm = !!session.db_id && updates;
  if (updateExistingFirm) {
    return await updateFirm(session.db_id, updates);
  } else if (session.fcaData) {
    const newFirm = await createFirm(session.fcaData);

    if (newFirm.response) {
      session.db_id = newFirm.response.id;
      await session.save();
    }

    return newFirm;
  } else {
    return { error: 'Error saving registration progress.' };
  }
};
