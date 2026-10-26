import { dbConnect } from 'lib/database/dbConnect';

import {
  type AdminE2eFirmKey,
  buildAdminE2eFirmSeed,
  getAdminE2eFirmMeta,
} from './adminE2eFirmConstants';

export type SetAdminE2eFirmStateResult = {
  success: boolean;
  firmId?: string;
  error?: string;
};

/**
 * CI-only: upsert the Cosmos admin e2e firm to its default seed
 * (A hidden+eligible, B active+eligible, C registration incomplete).
 */
export async function setAdminE2eFirmState(
  firm: AdminE2eFirmKey,
): Promise<SetAdminE2eFirmStateResult> {
  if (process.env.CI !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  const seed = buildAdminE2eFirmSeed(firm);
  const meta = getAdminE2eFirmMeta(firm);

  try {
    const { container } = await dbConnect();
    await container.items.upsert(seed);
    return { success: true, firmId: meta.id };
  } catch (error) {
    console.error('Failed to seed admin e2e firm:', error);
    return {
      success: false,
      error: 'Failed to seed admin e2e firm',
    };
  }
}

export async function setAdminE2eFirmsState(
  firms: AdminE2eFirmKey[] | 'all',
): Promise<SetAdminE2eFirmStateResult> {
  if (process.env.CI !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  const keys: AdminE2eFirmKey[] = firms === 'all' ? ['A', 'B', 'C'] : firms;

  let lastId: string | undefined;
  for (const firm of keys) {
    const result = await setAdminE2eFirmState(firm);
    if (!result.success) {
      return result;
    }
    lastId = result.firmId;
  }

  return { success: true, firmId: lastId };
}
