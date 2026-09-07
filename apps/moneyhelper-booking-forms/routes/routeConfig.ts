import {
  AccessBsl,
  AccessLanguage,
  AccessOptions,
  AccessSupport,
  AddressConfirmation,
  AddressDetails,
  AppointmentDateTime,
  AppointmentFound,
  AppointmentType,
  CommunicationPreferences,
  Confirmation,
  ConfirmDetails,
  ContactDetails,
  DivorceAppointment,
  DivorceNotEligible,
  EligibilityAgeExceptions,
  EligibilityBusinessState,
  EligibilityDefinedContribution,
  EligibilityDivorceJurisdiction,
  EligibilityFinancialSettlement,
  EligibilityOver50,
  EligibilityPensionLoss,
  EligibilityPensionProvider,
  EligibilityUKPensions,
  ErrorComponent,
  FindAppointment,
  Loading,
  PensionLossAppointment,
  PensionLossNotEligible,
  PensionSafeguardingAppointment,
  PensionWiseAppointment,
  PensionWiseNotEligible,
  PreAppointment,
  SelfEmployedAppointment,
} from '../components';
import { Guards, SidebarType, StepName } from '../lib/constants';
import { BookingRouteConfig } from '../lib/types';

/**
 * BookingRouteConfig extends the base RouteConfig to include additional properties specific to the booking forms application.
 * - `sidebar`: Optional property to specify the type of sidebar to display for the step. Can be either 'help' or 'information'.
 * - `hideBackStep`: Optional boolean to indicate whether the back button should be hidden for this step.
 * - `hideBackStepInEditMode`: Optional boolean to indicate whether the back button should be hidden when the user is in edit mode for this step.
 * - `hasTitle`: Optional boolean to indicate whether the step should display a title. Defaults to true. A page can still opt out entirely by not passing a `heading` prop to BookingFormsLayout.
 * - hideTitle is an optional boolean that can be used to hide the title for a specific step. If set to true, the title will not be displayed for that step.
 *
 * This interface allows for more granular control over the behavior and appearance of each step in the booking flow, enabling a tailored user experience based on the specific requirements of each step.
 *
 * Note: A page can still opt out entirely by not passing a `back` prop to BookingFormsLayout, regardless of the `hideBackStep` or `hideBackStepInEditMode` settings.
 */
export const routeConfig: BookingRouteConfig = {
  [StepName.APPOINTMENT_TYPE]: {
    Component: AppointmentType,
    guards: [
      Guards.JOURNEY_ENTRY_GUARD,
      Guards.AUTO_ADVANCE_GUARD,
      Guards.VALIDATE_STEP_GUARD,
    ],
    sidebarType: SidebarType.HELP,
  },
  [StepName.PENSION_WISE_APPOINTMENT]: {
    Component: PensionWiseAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.SELF_EMPLOYED_APPOINTMENT]: {
    Component: SelfEmployedAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.DIVORCE_APPOINTMENT]: {
    Component: DivorceAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.PENSION_LOSS_APPOINTMENT]: {
    Component: PensionLossAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.PENSION_SAFEGUARDING_APPOINTMENT]: {
    Component: PensionSafeguardingAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_DEFINED_CONTRIBUTION]: {
    Component: EligibilityDefinedContribution,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_OVER_50]: {
    Component: EligibilityOver50,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_UK_PENSIONS]: {
    Component: EligibilityUKPensions,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_AGE_EXCEPTIONS]: {
    Component: EligibilityAgeExceptions,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.ELIGIBILITY_BUSINESS_STATE]: {
    Component: EligibilityBusinessState,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT]: {
    Component: EligibilityFinancialSettlement,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ELIGIBILITY_DIVORCE_JURISDICTION]: {
    Component: EligibilityDivorceJurisdiction,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ELIGIBILITY_PENSION_LOSS]: {
    Component: EligibilityPensionLoss,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ELIGIBILITY_PENSION_PROVIDER]: {
    Component: EligibilityPensionProvider,
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
    guards: [
      Guards.COOKIE_GUARD,
      Guards.VALIDATE_STEP_GUARD,
      Guards.EDIT_MODE_INIT_GUARD,
    ],
    sidebarType: SidebarType.HELP,
    hideBackStepInEditMode: true,
  },
  [StepName.ACCESS_OPTIONS]: {
    Component: AccessOptions,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.ACCESS_LANGUAGE]: {
    Component: AccessLanguage,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.ACCESS_BSL]: {
    Component: AccessBsl,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.HELP,
  },
  [StepName.PRE_APPOINTMENT]: {
    Component: PreAppointment,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    sidebarType: SidebarType.INFORMATION,
  },
  [StepName.APPOINTMENT_DATE_TIME]: {
    Component: AppointmentDateTime,
    guards: [
      Guards.COOKIE_GUARD,
      Guards.VALIDATE_STEP_GUARD,
      Guards.EDIT_MODE_INIT_GUARD,
    ],
    sidebarType: SidebarType.INFORMATION,
    hideBackStepInEditMode: true,
    hideTitle: true,
  },
  [StepName.CONTACT_DETAILS]: {
    Component: ContactDetails,
    guards: [
      Guards.COOKIE_GUARD,
      Guards.VALIDATE_STEP_GUARD,
      Guards.EDIT_MODE_INIT_GUARD,
    ],
    sidebarType: SidebarType.INFORMATION,
    hideBackStepInEditMode: true,
  },
  [StepName.COMMUNICATION_PREFERENCES]: {
    Component: CommunicationPreferences,
    guards: [
      Guards.COOKIE_GUARD,
      Guards.VALIDATE_STEP_GUARD,
      Guards.EDIT_MODE_INIT_GUARD,
    ],
    hideBackStepInEditMode: true,
  },
  [StepName.ADDRESS_DETAILS]: {
    Component: AddressDetails,
    guards: [
      Guards.COOKIE_GUARD,
      Guards.VALIDATE_STEP_GUARD,
      Guards.EDIT_MODE_INIT_GUARD,
    ],
  },
  [StepName.ADDRESS_CONFIRMATION]: {
    Component: AddressConfirmation,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.CONFIRM_DETAILS]: {
    Component: ConfirmDetails,
    guards: [
      Guards.COOKIE_GUARD,
      Guards.VALIDATE_STEP_GUARD,
      Guards.CLEAR_EDIT_MODE_GUARD,
    ],
    hideBackStep: true,
  },
  [StepName.CONFIRMATION]: {
    Component: Confirmation,
    guards: [Guards.COOKIE_GUARD],
    hideTitle: true,
  },
  [StepName.FIND_APPOINTMENT]: {
    Component: FindAppointment,
    guards: [Guards.JOURNEY_ENTRY_GUARD],
    sidebarType: SidebarType.HELP,
    hideBackStep: true,
  },
  [StepName.APPOINTMENT_FOUND]: {
    Component: AppointmentFound,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
    hideTitle: true,
  },
  [StepName.ERROR]: {
    Component: ErrorComponent,
    guards: [],
  },
  [StepName.LOADING]: {
    Component: Loading,
    guards: [],
    hideTitle: true,
  },
};
