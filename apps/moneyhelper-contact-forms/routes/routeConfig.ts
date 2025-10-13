import {
  AboutDebt,
  AboutInsurance,
  AboutMHPD,
  AboutMoneyManagement,
  AboutPensionDivorce,
  AboutPensionTracing,
  AboutPensionWise,
  AboutScams,
  AboutStatePension,
  AppointmentType,
  Confirmation,
  ContactDetails,
  DateOfBirth,
  Enquiry,
  EnquiryType,
  ErrorComponent,
  InsuranceType,
  Loading,
  Name,
  PensionType,
} from '../components';
import { Guards, StepName } from '../lib/constants';
import { RouteConfig } from '../lib/types';

export const routeConfig: RouteConfig = {
  [StepName.ENQUIRY_TYPE]: {
    Component: EnquiryType,
    guards: [Guards.AUTO_ADVANCE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.INSURANCE_TYPE]: {
    Component: InsuranceType,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.PENSION_TYPE]: {
    Component: PensionType,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.APPOINTMENT_TYPE]: {
    Component: AppointmentType,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.NAME]: {
    Component: Name,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.DATE_OF_BIRTH]: {
    Component: DateOfBirth,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.CONTACT_DETAILS]: {
    Component: ContactDetails,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ENQUIRY]: {
    Component: Enquiry,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.CONFIRMATION]: {
    Component: Confirmation,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ERROR]: {
    Component: ErrorComponent,
    guards: [],
  },
  [StepName.ABOUT_SCAMS]: {
    Component: AboutScams,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_DEBT]: {
    Component: AboutDebt,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_INSURANCE]: {
    Component: AboutInsurance,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_STATE_PENSION]: {
    Component: AboutStatePension,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_PENSION_TRACING]: {
    Component: AboutPensionTracing,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_MHPD]: {
    Component: AboutMHPD,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_MONEY_MANAGEMENT]: {
    Component: AboutMoneyManagement,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_PENSION_WISE]: {
    Component: AboutPensionWise,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.ABOUT_PENSION_DIVORCE]: {
    Component: AboutPensionDivorce,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.LOADING]: {
    Component: Loading,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
};
