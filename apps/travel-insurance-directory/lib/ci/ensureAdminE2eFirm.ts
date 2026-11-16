import { dbConnect } from 'lib/database/dbConnect';
import { getFirmById } from 'lib/firms/fetchFirm';
import { isMainFirm } from 'lib/firms/firmDocument';

import {
  type AdminE2eFirmKey,
  buildAdminE2eFirmSeed,
  getAdminE2eFirmMeta,
} from './adminE2eFirmConstants';

export type EnsureAdminE2eFirmResult = {
  success: boolean;
  firmId?: string;
  created?: boolean;
  error?: string;
};

/**
 * CI-only: ensure the Cosmos admin e2e firm document exists (create if missing).
 * Does not reset fields — use {@link setAdminE2eFirmState} for seed state.
 */
export async function ensureAdminE2eFirm(
  firm: AdminE2eFirmKey,
): Promise<EnsureAdminE2eFirmResult> {
  if (process.env.CI !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  const meta = getAdminE2eFirmMeta(firm);
  const existing = await getFirmById(meta.id);

  if (existing.success && existing.response && isMainFirm(existing.response)) {
    return { success: true, firmId: meta.id, created: false };
  }

  const seed = buildAdminE2eFirmSeed(firm);

  try {
    const { container } = await dbConnect();
    await container.items.create(seed);
    return { success: true, firmId: meta.id, created: true };
  } catch (error) {
    console.error('Failed to create admin e2e firm:', error);
    return {
      success: false,
      error: 'Failed to create admin e2e firm',
    };
  }
}

export async function ensureAdminE2eFirms(
  firms: AdminE2eFirmKey[] = ['A', 'B', 'C'],
): Promise<EnsureAdminE2eFirmResult> {
  if (process.env.CI !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  for (const firm of firms) {
    const result = await ensureAdminE2eFirm(firm);
    if (!result.success) {
      return result;
    }
  }

  return { success: true };
}
