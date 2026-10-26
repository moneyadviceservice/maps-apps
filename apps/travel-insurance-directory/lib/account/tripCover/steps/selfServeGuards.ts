import {
  areTripCoversComplete,
  isMedicalSpecialismsComplete,
  isServiceDetailsComplete,
} from 'lib/account/dashboard/firmSectionStatus';
import type {
  TravelInsuranceFirmDocument,
  TripCover,
} from 'types/travel-insurance-firm';

import {
  confirmPath,
  medicalSpecialismPath,
  serviceDetailsPath,
} from './tripCoverRoutes';
import { getFirstIncompleteStepPath } from './tripCoverSteps';

export const SELF_SERVE_GUARD_PAGE = {
  confirm: 'confirm',
  serviceDetails: 'service-details',
  medicalSpecialism: 'medical-specialism',
} as const;

export type SelfServeGuardPage =
  (typeof SELF_SERVE_GUARD_PAGE)[keyof typeof SELF_SERVE_GUARD_PAGE];

export type SelfServeGuardContext =
  | { page: typeof SELF_SERVE_GUARD_PAGE.confirm }
  | {
      page: typeof SELF_SERVE_GUARD_PAGE.serviceDetails;
      isChangeAnswer?: boolean;
    }
  | {
      page: typeof SELF_SERVE_GUARD_PAGE.medicalSpecialism;
      isChangeAnswer?: boolean;
    };

type CompletionState = {
  tripCovers: TripCover[];
  tripCoversIncomplete: boolean;
  medicalSpecialismsIncomplete: boolean;
  serviceDetailsIncomplete: boolean;
};

type JourneySection = 'tripCovers' | 'medical' | 'service';

const JOURNEY_SECTIONS: Record<
  JourneySection,
  {
    isIncomplete: (state: CompletionState) => boolean;
    path: (firmId: string, state: CompletionState) => string | null;
  }
> = {
  tripCovers: {
    isIncomplete: (state) => state.tripCoversIncomplete,
    path: (firmId, state) =>
      getFirstIncompleteStepPath(firmId, state.tripCovers),
  },
  medical: {
    isIncomplete: (state) => state.medicalSpecialismsIncomplete,
    path: (firmId) => medicalSpecialismPath(firmId),
  },
  service: {
    isIncomplete: (state) => state.serviceDetailsIncomplete,
    path: (firmId) => serviceDetailsPath(firmId),
  },
};

const PRIOR_SECTIONS = {
  [SELF_SERVE_GUARD_PAGE.confirm]: ['tripCovers', 'medical', 'service'],
  [SELF_SERVE_GUARD_PAGE.medicalSpecialism]: ['tripCovers'],
  [SELF_SERVE_GUARD_PAGE.serviceDetails]: ['tripCovers', 'medical'],
} as const satisfies Record<SelfServeGuardPage, readonly JourneySection[]>;

function getCompletionState(
  firm: TravelInsuranceFirmDocument,
): CompletionState {
  const tripCovers = firm.trip_covers ?? [];

  return {
    tripCovers,
    tripCoversIncomplete: !areTripCoversComplete(tripCovers),
    medicalSpecialismsIncomplete: !isMedicalSpecialismsComplete(
      firm.medical_specialisms,
    ),
    serviceDetailsIncomplete: !isServiceDetailsComplete(firm.service_details),
  };
}

function firstIncompleteSectionPath(
  firmId: string,
  state: CompletionState,
  sections: readonly JourneySection[],
  options: { stopAtIncompleteTripCovers: boolean },
): string | null {
  for (const section of sections) {
    const { isIncomplete, path } = JOURNEY_SECTIONS[section];
    if (!isIncomplete(state)) {
      continue;
    }

    const redirect = path(firmId, state);

    // Confirm must not skip ahead when trip covers are incomplete but have no step yet.
    if (section === 'tripCovers' && options.stopAtIncompleteTripCovers) {
      return redirect;
    }

    if (redirect) {
      return redirect;
    }
  }

  return null;
}

function isChangingAnswer(context: SelfServeGuardContext): boolean {
  return (
    context.page !== SELF_SERVE_GUARD_PAGE.confirm &&
    Boolean(context.isChangeAnswer)
  );
}

export function getSelfServeApiRedirectIfIncomplete(
  firmId: string,
  firm: TravelInsuranceFirmDocument,
): string | null {
  const state = getCompletionState(firm);
  const anyIncomplete =
    state.tripCoversIncomplete ||
    state.medicalSpecialismsIncomplete ||
    state.serviceDetailsIncomplete;

  return anyIncomplete ? confirmPath(firmId) : null;
}

export function getSelfServeRedirectIfIncomplete(
  firmId: string,
  firm: TravelInsuranceFirmDocument,
  context: SelfServeGuardContext,
): string | null {
  if (isChangingAnswer(context)) {
    return null;
  }

  return firstIncompleteSectionPath(
    firmId,
    getCompletionState(firm),
    PRIOR_SECTIONS[context.page],
    {
      stopAtIncompleteTripCovers:
        context.page === SELF_SERVE_GUARD_PAGE.confirm,
    },
  );
}
