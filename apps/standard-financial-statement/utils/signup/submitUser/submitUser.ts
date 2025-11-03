import { FormEvent } from 'react';

import { FormType } from 'data/form-data/org_signup';
import { ZodError } from 'zod';

import { validateUserForm } from '../validation/user';

interface SubmitUserParams {
  e: FormEvent<HTMLFormElement>;
  formMode: FormType;
  setSubmitButtonDisabled: (disabled: boolean) => void;
  setExistingOrgSignup: (data: {
    orgName: string;
    isExisting: boolean;
  }) => void;
  setEmailAddress: (email: string) => void;
  setShowOTP: (show: boolean) => void;
  switchFormType: (form: FormType) => void;
  handleUserErrors: (errors: ZodError<unknown>) => void;
  handleOtpErrors: (
    response: { error: string; name: string },
    email: string,
  ) => void;
  resetFormErrors: () => void;
}

export async function submitUser({
  e,
  formMode,
  setSubmitButtonDisabled,
  setExistingOrgSignup,
  setEmailAddress,
  setShowOTP,
  switchFormType,
  handleUserErrors,
  handleOtpErrors,
  resetFormErrors,
}: SubmitUserParams) {
  e.preventDefault();
  setSubmitButtonDisabled(true);

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());
  const otp = data.otp;

  const validation = validateUserForm(data);
  if (!validation.success && validation.errors) {
    handleUserErrors(validation.errors);

    console.error('Validation failed', validation);

    return;
  }

  resetFormErrors();
  const email = validation.data?.emailAddress;

  if (!email) {
    console.error('No email', validation.data);
    return;
  }

  const payload = { ...validation.data, otp };

  try {
    const response = await fetch(`/api/user-sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (response.error) {
      console.error('Next api route call failed', response);

      handleOtpErrors(response, email);

      return;
    }

    if (response.success) {
      setExistingOrgSignup({
        orgName: response.organisationName ?? '',
        isExisting: formMode === FormType.ACTIVE_ORG,
      });

      switchFormType(FormType.SUCCESS);
    } else {
      setEmailAddress(email);
      setShowOTP(true);
      setSubmitButtonDisabled(false);
      switchFormType(FormType.OTP);
    }
  } catch (err) {
    console.error('Error in handleSubmitUser:', err);
    setSubmitButtonDisabled(false);
  }
}
