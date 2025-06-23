import {
  AboutDebt,
  AboutInsurance,
  AboutMHPD,
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
  InsuranceType,
  Loading,
  Name,
  PensionsAndRetirement,
} from '../components';
import { cookieGuard, validateStepGuard } from '../guards/';
import { StepName } from '../lib/constants';
import { RouteConfig } from '../lib/types';

export const routeConfig: RouteConfig = {
  [StepName.ENQUIRY_TYPE]: {
    Component: EnquiryType,
    guards: [validateStepGuard],
  },
  [StepName.INSURANCE_TYPE]: {
    Component: InsuranceType,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.PENSIONS_AND_RETIREMENT]: {
    Component: PensionsAndRetirement,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.APPOINTMENT_TYPE]: {
    Component: AppointmentType,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.NAME]: {
    Component: Name,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.DATE_OF_BIRTH]: {
    Component: DateOfBirth,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.CONTACT_DETAILS]: {
    Component: ContactDetails,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ENQUIRY]: {
    Component: Enquiry,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.CONFIRMATION]: {
    Component: Confirmation,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_SCAMS]: {
    Component: AboutScams,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_DEBT]: {
    Component: AboutDebt,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_INSURANCE]: {
    Component: AboutInsurance,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_STATE_PENSION]: {
    Component: AboutStatePension,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_PENSION_TRACING]: {
    Component: AboutPensionTracing,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_MHPD]: {
    Component: AboutMHPD,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_PENSION_WISE]: {
    Component: AboutPensionWise,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.ABOUT_PENSION_DIVORCE]: {
    Component: AboutPensionDivorce,
    guards: [cookieGuard, validateStepGuard],
  },
  [StepName.LOADING]: {
    Component: Loading,
    guards: [cookieGuard, validateStepGuard],
  },
};
