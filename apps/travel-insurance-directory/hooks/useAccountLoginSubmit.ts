import { FormEvent } from 'react';

import { NextRouter } from 'next/router';

import { accountAuthRoutes } from 'lib/accountAuth/routes';
import type { InputErrorTypes } from 'types/register';

type FormErrorsState = Record<string, { error: InputErrorTypes }>;

type Options = {
  router: NextRouter;
  setEmail: (email: string) => void;
  setErrors: (errors: FormErrorsState | null) => void;
  setShowOTP: (show: boolean) => void;
};

function extractEmail(data: Record<string, unknown>) {
  const email = ((data.email as string) ?? '').trim();
  return email || null;
}

export function useAccountLoginSubmit({
  router,
  setEmail,
  setErrors,
  setShowOTP,
}: Options) {
  return async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const nextEmail = extractEmail(data);
    if (nextEmail) setEmail(nextEmail);

    // (OTP step posts to /verify even when otp="").
    const endpoint =
      e.currentTarget.action ||
      (data.otp ? accountAuthRoutes.api.verify : accountAuthRoutes.api.start);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (response.error) {
        setErrors(response.fields ?? null);
        return;
      }

      setErrors(null);

      if (data.otp) {
        await router.push(accountAuthRoutes.pages.accountHome);
      } else {
        setShowOTP(true);
      }
    } catch (err) {
      console.error('Account login submit failed:', err);
      setErrors({ page: { error: 'general_error' } });
    }
  };
}
