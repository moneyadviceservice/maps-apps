import { FormStep } from 'data/form-data/org_signup';

import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

export const trackFormSteps = (
  addEvent: (data: AnalyticsData) => void,
  step: FormStep,
  isNewOrg: boolean,
  isInitial: boolean,
) => {
  const signUpType = isNewOrg ? 'New Org' : 'Active Org';
  if (
    (step === FormStep.NEW_ORG || step === FormStep.EXISTING_ORG) &&
    isInitial
  ) {
    addEvent({
      event: 'Start',
      eventInfo: {
        stepName: `sfs-application-form`,
        reactCompName: `SFS Application Form ${signUpType}`,
      },
    });
  }

  if (step === FormStep.NEW_ORG || step === FormStep.NEW_ORG_USER) {
    addEvent({
      event: 'formStarted',
      eventInfo: {
        stepName: `in-progress-Part-${step === FormStep.NEW_ORG ? 1 : 2}`,
        reactCompName: `SFS Application Form ${signUpType}`,
      },
    });
  }

  if (step === FormStep.EXISTING_ORG) {
    addEvent({
      event: 'formStarted',
      eventInfo: {
        stepName: `in-progress-Part-1`,
        reactCompName: `SFS Application Form ${signUpType}`,
      },
    });
  }

  if (step === FormStep.OTP) {
    addEvent({
      event: 'formStarted',
      eventInfo: {
        stepName: `in-progress-Part-${isNewOrg ? 3 : 2}`,
        reactCompName: `SFS Application Form ${signUpType}`,
      },
    });
  }

  if (step === FormStep.SUCCESS) {
    addEvent({
      event: 'formSubmitted',
      eventInfo: {
        stepName: `Complete`,
        reactCompName: `SFS Application Form ${signUpType}`,
      },
    });
  }
};
