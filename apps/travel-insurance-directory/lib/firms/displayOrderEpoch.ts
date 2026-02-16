/**
 * Tracks when display_order was last updated so we can refresh it when the
 * time-based seed changes (e.g. new hour). Stored as a single document in Cosmos.
 */

import { generateSeed } from 'utils/shufflePACs';

import { dbConnect } from '../database/dbConnect';

const DISPLAY_ORDER_EPOCH_ID = 'display_order_epoch';

export type DisplayOrderEpochDoc = {
  id: string;
  seed_hour: number;
};

/**
 * Returns the stored seed hour for the last display_order update, or null if missing/error.
 */
export async function getDisplayOrderEpoch(): Promise<number | null> {
  const { container } = await dbConnect();
  try {
    const { resource } = await container
      .item(DISPLAY_ORDER_EPOCH_ID)
      .read<DisplayOrderEpochDoc>();
    return resource?.seed_hour ?? null;
  } catch {
    return null;
  }
}

/**
 * Writes the current seed hour so future requests know display_order is up to date.
 */
export async function setDisplayOrderEpoch(seedHour: number): Promise<void> {
  const { container } = await dbConnect();
  const doc: DisplayOrderEpochDoc = {
    id: DISPLAY_ORDER_EPOCH_ID,
    seed_hour: seedHour,
  };
  await container.items.upsert(doc);
}

/**
 * True if display_order has not been updated for the current hour (or never set).
 */
export async function isDisplayOrderExpired(): Promise<boolean> {
  const currentSeed = generateSeed(new Date());
  const stored = await getDisplayOrderEpoch();
  return stored === null || stored !== currentSeed;
}
