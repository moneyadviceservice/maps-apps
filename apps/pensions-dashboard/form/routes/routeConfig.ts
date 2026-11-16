import { RouteConfig } from '@maps-react/mhf/types';

import {
  AboutYou,
  AgreementAndConsent,
  DataAndPrivacy,
  Decline,
  HealthConditions,
  HealthConditionsImpact,
  Submit,
  WhereYouLive,
  YourSex,
} from '../components';
import { Guards, StepName } from '../constants';

/**
 * Central configuration for routes in the app. Each route can have custom properties such as the component to render and the guards to apply.
 *
 * View the shared-mhf documentation for more details on the available route configuration options.
 */
export const routeConfig: RouteConfig = {
  [StepName.DATA_AND_PRIVACY]: {
    Component: DataAndPrivacy,
    guards: [Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.AGREEMENT_AND_CONSENT]: {
    Component: AgreementAndConsent,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.DECLINE]: {
    Component: Decline,
    guards: [Guards.COOKIE_GUARD],
  },
  [StepName.ABOUT_YOU]: {
    Component: AboutYou,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.WHERE_YOU_LIVE]: {
    Component: WhereYouLive,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.YOUR_SEX]: {
    Component: YourSex,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.HEALTH_CONDITIONS]: {
    Component: HealthConditions,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.HEALTH_CONDITIONS_IMPACT]: {
    Component: HealthConditionsImpact,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
  [StepName.SUBMIT]: {
    Component: Submit,
    guards: [Guards.COOKIE_GUARD, Guards.VALIDATE_STEP_GUARD],
  },
};
