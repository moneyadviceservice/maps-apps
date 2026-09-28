import { isListedOnPublicDirectory } from 'lib/firms/fcaVisibility';
import { invalidateFirmsListingCache } from 'lib/firms/invalidateFirmsListingCache';
import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

/**
 * After a principal confirms listing data, drop the Redis firms cache
 * so public listings pick up the live Cosmos document on the next read.
 */
export async function resyncPublicListingIfApproved(
  firm: Pick<TravelInsuranceFirmDocument, 'status' | 'hidden_reason'>,
): Promise<void> {
  if (!isListedOnPublicDirectory(firm)) {
    return;
  }

  await invalidateFirmsListingCache();
}
