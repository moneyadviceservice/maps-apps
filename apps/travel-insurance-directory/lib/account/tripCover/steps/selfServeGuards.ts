import {
  areTripCoversComplete,
  isServiceDetailsComplete,
} from 'lib/account/firmSectionStatus';
import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { confirmPath, serviceDetailsPath } from './tripCoverRoutes';
import { getFirstIncompleteStepPath } from './tripCoverSteps';

type SelfServeGuardContext =
  | { page: 'confirm' }
  | { page: 'service-details'; isChangeAnswer?: boolean }
  | { page: 'confirm-api' };

export function getSelfServeRedirectIfIncomplete(
  firmId: string,
  firm: TravelInsuranceFirmDocument,
  context: SelfServeGuardContext,
): string | null {
  const tripCovers = firm.trip_covers ?? [];
  const tripCoversIncomplete = !areTripCoversComplete(tripCovers);
  const serviceDetailsIncomplete = !isServiceDetailsComplete(
    firm.service_details,
  );

  if (context.page === 'confirm-api') {
    return tripCoversIncomplete || serviceDetailsIncomplete
      ? confirmPath(firmId)
      : null;
  }

  if (context.page === 'service-details') {
    if (context.isChangeAnswer) {
      return null;
    }

    if (tripCovers.length > 0 && tripCoversIncomplete) {
      return getFirstIncompleteStepPath(firmId, tripCovers);
    }

    return null;
  }

  if (tripCoversIncomplete) {
    return getFirstIncompleteStepPath(firmId, tripCovers);
  }

  if (serviceDetailsIncomplete) {
    return serviceDetailsPath(firmId);
  }

  return null;
}
