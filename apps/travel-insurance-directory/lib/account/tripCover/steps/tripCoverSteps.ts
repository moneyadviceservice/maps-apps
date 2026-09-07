import {
  TRIP_COVER_REGION_OPTIONS,
  TRIP_COVER_TRIP_TYPES,
} from 'data/pages/account/tripCover/tripCoverConfig';
import { isTripCoverAgeStepComplete } from 'lib/account/tripCover/TripCoverAgeLimits';
import type {
  CoverArea,
  TripCover,
  TripType,
} from 'types/travel-insurance-firm';

import { ageLimitsPath } from './tripCoverRoutes';

export type TripCoverStep = {
  coverArea: CoverArea;
  tripType: TripType;
};

export function buildTripCoverSteps(tripCovers: TripCover[]): TripCoverStep[] {
  const selectedAreas = new Set(tripCovers.map((cover) => cover.cover_area));
  const steps: TripCoverStep[] = [];

  for (const region of TRIP_COVER_REGION_OPTIONS) {
    if (!selectedAreas.has(region.value)) {
      continue;
    }

    for (const tripType of TRIP_COVER_TRIP_TYPES) {
      const exists = tripCovers.some(
        (cover) =>
          cover.cover_area === region.value && cover.trip_type === tripType,
      );
      if (exists) {
        steps.push({ coverArea: region.value, tripType });
      }
    }
  }

  return steps;
}

export function findStepIndex(
  steps: TripCoverStep[],
  coverArea: CoverArea,
  tripType: TripType,
): number {
  return steps.findIndex(
    (step) => step.coverArea === coverArea && step.tripType === tripType,
  );
}

export function findTripCoverForStep(
  tripCovers: TripCover[],
  step: TripCoverStep,
): TripCover | undefined {
  return tripCovers.find(
    (cover) =>
      cover.cover_area === step.coverArea && cover.trip_type === step.tripType,
  );
}

export function getFirstStepPath(
  firmId: string,
  tripCovers: TripCover[],
): string | null {
  const firstStep = buildTripCoverSteps(tripCovers)[0];
  if (!firstStep) {
    return null;
  }

  return ageLimitsPath(firmId, firstStep.coverArea, firstStep.tripType);
}

export function getNextStepPath(
  firmId: string,
  tripCovers: TripCover[],
  current: TripCoverStep,
): string | null {
  const steps = buildTripCoverSteps(tripCovers);
  const index = findStepIndex(steps, current.coverArea, current.tripType);
  const nextStep = steps[index + 1];

  if (!nextStep) {
    return null;
  }

  return ageLimitsPath(firmId, nextStep.coverArea, nextStep.tripType);
}

export function getPreviousStepPath(
  firmId: string,
  tripCovers: TripCover[],
  current: TripCoverStep,
): string | null {
  const steps = buildTripCoverSteps(tripCovers);
  const index = findStepIndex(steps, current.coverArea, current.tripType);
  const previousStep = steps[index - 1];

  if (!previousStep) {
    return null;
  }

  return ageLimitsPath(firmId, previousStep.coverArea, previousStep.tripType);
}

export function getLastStepPath(
  firmId: string,
  tripCovers: TripCover[],
): string | null {
  const steps = buildTripCoverSteps(tripCovers);
  const lastStep = steps.at(-1);

  if (!lastStep) {
    return null;
  }

  return ageLimitsPath(firmId, lastStep.coverArea, lastStep.tripType);
}

export function getFirstIncompleteStepPath(
  firmId: string,
  tripCovers: TripCover[],
): string | null {
  const steps = buildTripCoverSteps(tripCovers);

  for (const step of steps) {
    const tripCover = findTripCoverForStep(tripCovers, step);

    if (!tripCover || !isTripCoverAgeStepComplete(tripCover)) {
      return ageLimitsPath(firmId, step.coverArea, step.tripType);
    }
  }

  return null;
}
