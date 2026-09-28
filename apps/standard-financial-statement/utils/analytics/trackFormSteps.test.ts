import { FormStep } from 'data/form-data/org_signup';

import { trackFormSteps } from './trackFormSteps';

describe('trackFormSteps', () => {
  let addEventMock: jest.Mock;

  beforeEach(() => {
    addEventMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fire Start and formStarted for NEW_ORG initial step', () => {
    trackFormSteps(addEventMock, FormStep.NEW_ORG, true, true);

    expect(addEventMock).toHaveBeenCalledTimes(2);

    expect(addEventMock).toHaveBeenNthCalledWith(1, {
      event: 'Start',
      eventInfo: {
        stepName: 'sfs-application-form',
        reactCompName: 'SFS Application Form New Org',
      },
    });

    expect(addEventMock).toHaveBeenNthCalledWith(2, {
      event: 'formStarted',
      eventInfo: {
        stepName: 'in-progress-Part-1',
        reactCompName: 'SFS Application Form New Org',
      },
    });
  });

  it('should fire Start and formStarted for EXISTING_ORG initial step', () => {
    trackFormSteps(addEventMock, FormStep.EXISTING_ORG, false, true);

    expect(addEventMock).toHaveBeenCalledTimes(2);

    expect(addEventMock).toHaveBeenNthCalledWith(1, {
      event: 'Start',
      eventInfo: {
        stepName: 'sfs-application-form',
        reactCompName: 'SFS Application Form Active Org',
      },
    });

    expect(addEventMock).toHaveBeenNthCalledWith(2, {
      event: 'formStarted',
      eventInfo: {
        stepName: 'in-progress-Part-1',
        reactCompName: 'SFS Application Form Active Org',
      },
    });
  });

  it('should fire only formStarted for NEW_ORG_USER', () => {
    trackFormSteps(addEventMock, FormStep.NEW_ORG_USER, true, false);

    expect(addEventMock).toHaveBeenCalledTimes(1);
    expect(addEventMock).toHaveBeenCalledWith({
      event: 'formStarted',
      eventInfo: {
        stepName: 'in-progress-Part-2',
        reactCompName: 'SFS Application Form New Org',
      },
    });
  });

  it('should fire correct formStarted for OTP (new org)', () => {
    trackFormSteps(addEventMock, FormStep.OTP, true, false);

    expect(addEventMock).toHaveBeenCalledTimes(1);
    expect(addEventMock).toHaveBeenCalledWith({
      event: 'formStarted',
      eventInfo: {
        stepName: 'in-progress-Part-3',
        reactCompName: 'SFS Application Form New Org',
      },
    });
  });

  it('should fire correct formStarted for OTP (existing org)', () => {
    trackFormSteps(addEventMock, FormStep.OTP, false, false);

    expect(addEventMock).toHaveBeenCalledTimes(1);
    expect(addEventMock).toHaveBeenCalledWith({
      event: 'formStarted',
      eventInfo: {
        stepName: 'in-progress-Part-2',
        reactCompName: 'SFS Application Form Active Org',
      },
    });
  });

  it('should fire formSubmitted for SUCCESS step', () => {
    trackFormSteps(addEventMock, FormStep.SUCCESS, true, false);

    expect(addEventMock).toHaveBeenCalledTimes(1);
    expect(addEventMock).toHaveBeenCalledWith({
      event: 'formSubmitted',
      eventInfo: {
        stepName: 'Complete',
        reactCompName: 'SFS Application Form New Org',
      },
    });
  });
});
