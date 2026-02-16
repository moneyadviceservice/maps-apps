import {
  AppointmentType,
  EligibilityAgeExceptions,
  EligibilityDefinedContribution,
  EligibilityOver50,
  EligibilityUKPensions,
  ErrorComponent,
  Loading,
  PensionWiseAppointment,
  PensionWiseNotEligible,
} from '../components';
import { Guards, SidebarType, StepName } from '../lib/constants';
import { BookingRouteConfig } from '../lib/types';

/**
 * Route configuration mapping step names to their components and guards.
 * Can be used in static page files (e.g., pages/[language]/staticPage/index.tsx) or dynamically in pages like pages/[language]/[step]/index.tsx to look up the appropriate component and guards based on the current step.
 * NOTE: This can be expanded on a case-by-case basis to include additional per-step properties as needed (e.g., UI styling, layout variants, custom behavior flags).
 * @returns {BookingRouteConfig} The route configuration object.
 */
export const routeConfig: BookingRouteConfig = {
  [StepName.APPOINTMENT_TYPE]: {
    Component: AppointmentType,
    guards: [Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.PENSION_WISE_APPOINTMENT]: {
    Component: PensionWiseAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_DEFINED_CONTRIBUTION]: {
    Component: EligibilityDefinedContribution,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_OVER_50]: {
    Component: EligibilityOver50,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_UK_PENSIONS]: {
    Component: EligibilityUKPensions,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_AGE_EXCEPTIONS]: {
    Component: EligibilityAgeExceptions,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.PENSION_WISE_NOT_ELIGIBLE]: {
    Component: PensionWiseNotEligible,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ERROR]: {
    Component: ErrorComponent,
    guards: [],
  },
  [StepName.LOADING]: {
    Component: Loading,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
};
