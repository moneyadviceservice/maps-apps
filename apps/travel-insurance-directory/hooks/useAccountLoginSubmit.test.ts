import { NextRouter } from 'next/router';

import { accountAuthRoutes } from 'lib/accountAuth/routes';
import { act, renderHook } from '@testing-library/react';

import { useAccountLoginSubmit } from './useAccountLoginSubmit';

function createForm(inputs: { name: string; value: string }[]) {
  const form = document.createElement('form');
  // Match runtime behaviour: the page sets form.action depending on OTP step.
  form.action = inputs.some(({ name }) => name === 'otp')
    ? accountAuthRoutes.api.verify
    : accountAuthRoutes.api.start;
  inputs.forEach(({ name, value }) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  return form;
}

function setBlankFormAction(form: HTMLFormElement) {
  // `action || (otp ? verify : start)`.
  Object.defineProperty(form, 'action', { value: '', configurable: true });
}

function createSubmitEvent(form: HTMLFormElement) {
  return {
    preventDefault: jest.fn(),
    currentTarget: form,
  } as unknown as React.FormEvent<HTMLFormElement>;
}

function setup() {
  const router = { push: jest.fn() } as unknown as NextRouter;
  const setEmail = jest.fn();
  const setErrors = jest.fn();
  const setShowOTP = jest.fn();

  const hook = renderHook(() =>
    useAccountLoginSubmit({ router, setEmail, setErrors, setShowOTP }),
  );

  async function submitForm(form: HTMLFormElement) {
    await act(async () => {
      await hook.result.current(createSubmitEvent(form));
    });
  }

  async function submit(inputs: { name: string; value: string }[]) {
    const form = createForm(inputs);
    await submitForm(form);
  }

  return { router, setEmail, setErrors, setShowOTP, submit, submitForm };
}

describe('useAccountLoginSubmit', () => {
  const fetchMock = jest.fn();

  beforeAll(() => {
    globalThis.fetch = fetchMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POSTs to start endpoint and shows OTP when email submitted', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true, otpSent: true }),
    });

    const t = setup();
    await t.submit([{ name: 'email', value: 'test@example.com' }]);

    expect(t.setEmail).toHaveBeenCalledWith('test@example.com');
    expect(fetchMock).toHaveBeenCalledWith(
      new URL(accountAuthRoutes.api.start, globalThis.location.href).toString(),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(t.setErrors).toHaveBeenCalledWith(null);
    expect(t.setShowOTP).toHaveBeenCalledWith(true);
  });

  it('does not setEmail when email is blank', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true, otpSent: true }),
    });

    const t = setup();
    await t.submit([{ name: 'email', value: '   ' }]);

    expect(t.setEmail).not.toHaveBeenCalled();
    expect(t.setShowOTP).toHaveBeenCalledWith(true);
  });

  it('does not setEmail when email field is missing', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true, otpSent: true }),
    });

    const t = setup();
    await t.submit([]);

    expect(t.setEmail).not.toHaveBeenCalled();
    expect(t.setShowOTP).toHaveBeenCalledWith(true);
  });

  it('POSTs to verify endpoint and navigates to /account when otp submitted', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    const t = setup();
    await t.submit([
      { name: 'email', value: 'test@example.com' },
      { name: 'otp', value: '123456' },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      new URL(
        accountAuthRoutes.api.verify,
        globalThis.location.href,
      ).toString(),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(t.router.push).toHaveBeenCalledWith(
      accountAuthRoutes.pages.accountHome,
    );
    expect(t.setShowOTP).not.toHaveBeenCalled();
  });

  it('falls back to start endpoint when form action is blank', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true, otpSent: true }),
    });

    const t = setup();
    const form = createForm([{ name: 'email', value: 'test@example.com' }]);
    setBlankFormAction(form);
    await t.submitForm(form);

    expect(fetchMock).toHaveBeenCalledWith(
      accountAuthRoutes.api.start,
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('falls back to verify endpoint when form action is blank and otp present', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    const t = setup();
    const form = createForm([
      { name: 'email', value: 'test@example.com' },
      { name: 'otp', value: '123456' },
    ]);
    setBlankFormAction(form);
    await t.submitForm(form);

    expect(fetchMock).toHaveBeenCalledWith(
      accountAuthRoutes.api.verify,
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sets field errors when API returns error', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({
        error: true,
        fields: { email: { error: 'required' } },
      }),
    });

    const t = setup();
    await t.submit([{ name: 'email', value: '' }]);

    expect(t.setErrors).toHaveBeenCalledWith({ email: { error: 'required' } });
    expect(t.router.push).not.toHaveBeenCalled();
    expect(t.setShowOTP).not.toHaveBeenCalled();
  });

  it('sets null errors when API returns error without fields', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({
        error: true,
      }),
    });

    const t = setup();
    await t.submit([{ name: 'email', value: 'test@example.com' }]);

    expect(t.setErrors).toHaveBeenCalledWith(null);
    expect(t.router.push).not.toHaveBeenCalled();
    expect(t.setShowOTP).not.toHaveBeenCalled();
  });

  it('sets general_error on network failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'));

    const t = setup();
    await t.submit([{ name: 'email', value: 'test@example.com' }]);

    expect(t.setErrors).toHaveBeenCalledWith({
      page: { error: 'general_error' },
    });
  });
});
