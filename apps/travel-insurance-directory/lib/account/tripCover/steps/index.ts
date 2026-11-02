export type {
  SelfServeGuardContext,
  SelfServeGuardPage,
} from './selfServeGuards';
export {
  getSelfServeApiRedirectIfIncomplete,
  getSelfServeRedirectIfIncomplete,
  SELF_SERVE_GUARD_PAGE,
} from './selfServeGuards';
export {
  ageLimitsPath,
  confirmPath,
  medicalSpecialismPath,
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
