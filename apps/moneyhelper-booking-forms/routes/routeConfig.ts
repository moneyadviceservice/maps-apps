import {
  AccessLanguage,
  AccessOptions,
  AccessSupport,
  AppointmentType,
  DivorceAppointment,
  DivorceNotEligible,
  DivorcePreAppointment,
  EligibilityAgeExceptions,
  EligibilityBusinessState,
  EligibilityDefinedContribution,
  EligibilityFinancialSettlement,
  EligibilityOver50,
  EligibilityPensionLoss,
  EligibilityUKPensions,
  ErrorComponent,
  Loading,
  PensionLossAppointment,
  PensionLossNotEligible,
  PensionLossPreAppointment,
  PensionWiseAppointment,
  PensionWiseNotEligible,
  PensionWisePreAppointment,
  SelfEmployedAppointment,
  SelfEmployedPreAppointment,
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
  [StepName.SELF_EMPLOYED_APPOINTMENT]: {
    Component: SelfEmployedAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.DIVORCE_APPOINTMENT]: {
    Component: DivorceAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.PENSION_LOSS_APPOINTMENT]: {
    Component: PensionLossAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.PENSION_WISE_PRE_APPOINTMENT]: {
    Component: PensionWisePreAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.INFORMATION,
  },
  [StepName.SELF_EMPLOYED_PRE_APPOINTMENT]: {
    Component: SelfEmployedPreAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.INFORMATION,
  },
  [StepName.DIVORCE_PRE_APPOINTMENT]: {
    Component: DivorcePreAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.INFORMATION,
  },
  [StepName.PENSION_LOSS_PRE_APPOINTMENT]: {
    Component: PensionLossPreAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.INFORMATION,
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
  [StepName.ELIGIBILITY_BUSINESS_STATE]: {
    Component: EligibilityBusinessState,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT]: {
    Component: EligibilityFinancialSettlement,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ELIGIBILITY_PENSION_LOSS]: {
    Component: EligibilityPensionLoss,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.PENSION_WISE_NOT_ELIGIBLE]: {
    Component: PensionWiseNotEligible,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.DIVORCE_NOT_ELIGIBLE]: {
    Component: DivorceNotEligible,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.PENSION_LOSS_NOT_ELIGIBLE]: {
    Component: PensionLossNotEligible,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ACCESS_SUPPORT]: {
    Component: AccessSupport,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.ACCESS_OPTIONS]: {
    Component: AccessOptions,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
  },
  [StepName.ACCESS_LANGUAGE]: {
    Component: AccessLanguage,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebar: SidebarType.HELP,
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
