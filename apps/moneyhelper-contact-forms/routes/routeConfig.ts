import {
  Confirmation,
  ContactDetails,
  DateOfBirth,
  Enquiry,
  Name,
} from '../components';
import { AboutScams } from '../components/AboutScams';
import { EnquiryType } from '../components/EnquiryType';
import { cookieGuard, enquiryTypeGuard, validateStepGuard } from '../guards/';
import { StepName } from '../lib/constants';
import { RouteConfig } from '../lib/types';

export const routeConfig: RouteConfig = {
  [StepName.ENQUIRY_TYPE]: {
    Component: EnquiryType,
    guards: [validateStepGuard, enquiryTypeGuard],
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
};
