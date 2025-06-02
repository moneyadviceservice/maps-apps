import {
  AboutDebt,
  AboutInsurance,
  AboutMHPD,
  AboutPensionTracing,
  AboutScams,
  AboutStatePension,
  Confirmation,
  ContactDetails,
  DateOfBirth,
  Enquiry,
  EnquiryType,
  KindOfEnquiry,
  Name,
} from '../components';
import {
  cookieGuard,
  enquiryOptionsGuard,
  validateStepGuard,
} from '../guards/';
import { StepName } from '../lib/constants';
import { RouteConfig } from '../lib/types';

export const routeConfig: RouteConfig = {
  [StepName.ENQUIRY_TYPE]: {
    Component: EnquiryType,
    guards: [validateStepGuard, enquiryOptionsGuard],
  },
  [StepName.KIND_OF_ENQUIRY]: {
    Component: KindOfEnquiry,
    guards: [cookieGuard, validateStepGuard, enquiryOptionsGuard],
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
};
