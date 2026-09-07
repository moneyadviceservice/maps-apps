import { SubmitEvent } from 'react';

import type { NextRouter } from 'next/router';

import {
  FormStep,
  SIGN_UP_PART_1_ID,
  SIGN_UP_PART_2_ID,
} from 'data/form-data/org_signup';

import { submitOrg } from './submitOrg';

describe('submitOrg', () => {
  let mockEvent: Partial<SubmitEvent<HTMLFormElement>>;
  let mockRouter: jest.Mocked<NextRouter>;
  let handleErrors: jest.Mock;
  let resetErrors: jest.Mock;
  let switchFormStep: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    globalThis.fetch = jest.fn();

    const form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'orgName';
    input.value = 'Test Org';
    form.appendChild(input);

    mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: form,
    };

    mockRouter = {
      push: jest.fn().mockResolvedValue(true),
      replace: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<NextRouter>;

    handleErrors = jest.fn();
    resetErrors = jest.fn();
    switchFormStep = jest.fn();
  });

  it('submits form successfully and navigates to next step', async () => {
    const savedEntry = {
      data: { organisationName: 'Test Org' },
      errors: [],
    };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ entry: savedEntry }),
    });

    const onSuccess = jest.fn();

    await submitOrg({
      e: mockEvent as SubmitEvent<HTMLFormElement>,
      lang: 'en',
      router: mockRouter,
      handleErrors,
      resetErrors,
      switchFormStep,
      onSuccess,
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/fn/form-handler',
      expect.any(Object),
    );
    expect(resetErrors).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(savedEntry);
    expect(mockRouter.replace).toHaveBeenCalledWith(
      {
        pathname: '/en/apply-to-use-the-sfs',
        hash: SIGN_UP_PART_1_ID,
      },
      undefined,
      { scroll: false, shallow: true },
    );
    expect(switchFormStep).toHaveBeenCalledWith(FormStep.NEW_ORG_USER);
    expect(mockRouter.push).toHaveBeenCalledWith(
      {
        pathname: '/en/apply-to-use-the-sfs',
        query: { user: true },
        hash: SIGN_UP_PART_2_ID,
      },
      undefined,
      { scroll: false },
    );
  });

  it('handles server-side validation errors', async () => {
    const mockErrors = [{ name: 'orgName', message: 'Required' }];
    const mockData = {
      lang: 'en',
      flow: 'new',
      step: 'user',
      organisationName: 'org name',
      organisationStreet: '',
      organisationCity: '',
      organisationPostcode: '',
      geoRegions: [],
      organisationUse: '',
      sfslive: '',
      sfsLaunchDate: '',
      caseManagementSoftware: '',
      fcaReg: '',
      memberships: [],
      fcaRegNumber: '',
    };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        entry: { errors: mockErrors, data: mockData },
      }),
    });

    await submitOrg({
      e: mockEvent as SubmitEvent<HTMLFormElement>,
      lang: 'en',
      router: mockRouter,
      handleErrors,
      resetErrors,
      switchFormStep,
    });

    expect(handleErrors).toHaveBeenCalledWith(mockErrors, mockData);
    expect(resetErrors).not.toHaveBeenCalled();
    expect(switchFormStep).not.toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('logs error on network failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** no empty */
    });
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    await submitOrg({
      e: mockEvent as SubmitEvent<HTMLFormElement>,
      lang: 'en',
      router: mockRouter,
      handleErrors,
      resetErrors,
      switchFormStep,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error submitting org form:',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
