/**
 * Refreshes the firms cache in Redis: checks Redis for hour passed, then calls Cosmos
 * to fetch active firms, computes display order in memory, and writes ordered firms + epoch to Redis.
 * No Cosmos writes. Can be run as a script or triggered by the hourly cron / read path.
 */

import { refreshFirmsCacheIfNeeded } from '../lib/firms/refreshFirmsCache';

async function main(): Promise<void> {
  const result = await refreshFirmsCacheIfNeeded();
  console.log(
    result.refreshed
      ? `Refreshed Redis: ${result.firmsCount} firms`
      : 'Redis already up to date for current hour',
  );
  if (result.error) {
    console.error('Error:', result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
