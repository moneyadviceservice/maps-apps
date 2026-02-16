/**
 * Precomputes display_order for all active firms using shufflePACs logic.
 * Runs automatically when firms are requested (getFirmsPaginated) if the stored order
 * has expired (e.g. new hour). Import ensureDisplayOrderUpdated() or runUpdateDisplayOrder() as needed.
 *
 * Cosmos container partition key must match usage below (default: /id so item(id) is enough).
 */

import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { dbConnect } from '../lib/database/dbConnect';
import {
  isDisplayOrderExpired,
  setDisplayOrderEpoch,
} from '../lib/firms/displayOrderEpoch';
import { generateSeed, shuffleWithSeed } from '../utils/shufflePACs';

const ACTIVE_STATUS = 'active';

let ensurePromise: Promise<unknown> | null = null;

/**
 * Updates display_order for all active firms and records the current seed hour.
 */
export async function runUpdateDisplayOrder(): Promise<{
  updated: number;
  errors: number;
}> {
  const { container } = await dbConnect();

  const querySpec = {
    query: `SELECT * FROM c WHERE c.status = @status`,
    parameters: [{ name: '@status', value: ACTIVE_STATUS }],
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  const firms = resources as (TravelInsuranceFirmDocument & { id: string })[];
  const ids = firms.map((f) => f.id);

  if (ids.length === 0) {
    return { updated: 0, errors: 0 };
  }

  const seed = generateSeed(new Date());
  const shuffledIds = shuffleWithSeed(ids, seed);

  let updated = 0;
  let errors = 0;

  const idToFirm = new Map(firms.map((f) => [f.id, f]));

  for (let i = 0; i < shuffledIds.length; i++) {
    const id = shuffledIds[i];
    const existing = idToFirm.get(id);
    if (!existing) {
      console.error(`Missing firm in map for id=${id}`);
      errors++;
      continue;
    }
    try {
      const doc: TravelInsuranceFirmDocument & { id: string } = {
        ...existing,
        display_order: i,
      };
      await container.items.upsert(doc);
      updated++;
    } catch (err) {
      console.error(`Failed to update display_order for id=${id}:`, err);
      errors++;
    }
  }

  await setDisplayOrderEpoch(seed);
  return { updated, errors };
}

/**
 * If display_order is expired (e.g. new hour), runs the update once. Concurrent callers share the same run.
 * Call this before fetching firms so order is always current.
 */
export async function ensureDisplayOrderUpdated(): Promise<void> {
  const expired = await isDisplayOrderExpired();
  if (!expired) return;

  ensurePromise ??= runUpdateDisplayOrder().finally(() => {
    ensurePromise = null;
  });
  await ensurePromise;
}
