import { FormEvent } from 'react';

import type { NextRouter } from 'next/router';

import { FormStep } from 'data/form-data/org_signup';

import { submitOrg } from './submitOrg';

describe('submitOrg', () => {
  let mockEvent: Partial<FormEvent<HTMLFormElement>>;
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
      push: jest.fn(),
    } as unknown as jest.Mocked<NextRouter>;

    handleErrors = jest.fn();
    resetErrors = jest.fn();
    switchFormStep = jest.fn();
  });

  it('submits form successfully and navigates to next step', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ entry: { errors: [] } }),
    });

    await submitOrg({
      e: mockEvent as FormEvent<HTMLFormElement>,
      lang: 'en',
      router: mockRouter,
      handleErrors,
      resetErrors,
      switchFormStep,
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/fn/form-handler',
      expect.any(Object),
    );
    expect(resetErrors).toHaveBeenCalled();
    expect(switchFormStep).toHaveBeenCalledWith(FormStep.NEW_ORG_USER);
    expect(mockRouter.push).toHaveBeenCalledWith(
      {
        pathname: '/en/apply-to-use-the-sfs',
        query: { user: true },
        hash: 'sign-up-part-2',
      },
      undefined,
      { scroll: false },
    );
  });

  it('handles server-side validation errors', async () => {
    const mockErrors = [{ name: 'orgName', message: 'Required' }];

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        entry: { errors: mockErrors },
      }),
    });

    await submitOrg({
      e: mockEvent as FormEvent<HTMLFormElement>,
      lang: 'en',
      router: mockRouter,
      handleErrors,
      resetErrors,
      switchFormStep,
    });

    expect(handleErrors).toHaveBeenCalledWith(mockErrors);
    expect(resetErrors).not.toHaveBeenCalled();
    expect(switchFormStep).not.toHaveBeenCalled();
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
      e: mockEvent as FormEvent<HTMLFormElement>,
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
