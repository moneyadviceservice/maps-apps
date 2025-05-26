import {
  Confirmation,
  ContactDetails,
  DateOfBirth,
  Enquiry,
  Name,
} from '../components';
import { AboutDebt } from '../components/AboutDebt/AboutDebt';
import { AboutInsurance } from '../components/AboutInsurance';
import { AboutScams } from '../components/AboutScams';
import { EnquiryType } from '../components/EnquiryType';
import { KindOfEnquiry } from '../components/KindOfEnquiry';
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
    guards: [validateStepGuard, enquiryOptionsGuard],
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
};
