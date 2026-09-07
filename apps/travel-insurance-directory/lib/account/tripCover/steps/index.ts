export { getSelfServeRedirectIfIncomplete } from './selfServeGuards';
export {
  ageLimitsPath,
  confirmPath,
  regionsPath,
  serviceDetailsPath,
} from './tripCoverRoutes';
export type { TripCoverStep } from './tripCoverSteps';
export {
  buildTripCoverSteps,
  findStepIndex,
  findTripCoverForStep,
  getFirstIncompleteStepPath,
  getFirstStepPath,
  getLastStepPath,
  getNextStepPath,
  getPreviousStepPath,
} from './tripCoverSteps';
export {
  parseCoverAreas,
  parseTripCoverStepFromParams,
  parseTripCoverStepParams,
  VALID_COVER_AREAS,
  VALID_TRIP_TYPES,
} from './tripCoverValidation';
