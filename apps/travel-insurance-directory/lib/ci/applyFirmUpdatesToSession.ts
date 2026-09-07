import set from 'lodash/set';
import { IronSessionObject } from 'types/iron-session';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

function normalizeUpdatePath(path: string): string {
  return path.replace(/^\/+/, '').replaceAll('/', '.');
}

export const applyFirmUpdatesToSession = async (
  session: IronSessionObject,
  updates: Record<string, unknown>,
) => {
  session.db_id = session.db_id ?? 'playwright-id';

  session.firmData ??= {
    type: 'main',
    medical_coverage: { specific_conditions: {} },
  } as TravelInsuranceFirmDocument;

  for (const [path, value] of Object.entries(updates)) {
    set(session.firmData, normalizeUpdatePath(path), value);
  }

  await session.save();

  return { success: true, response: { id: session.db_id } };
};
