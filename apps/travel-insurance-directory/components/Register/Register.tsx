import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { page } from 'data/pages/register';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { twMerge } from 'tailwind-merge';
import { SUCCESS_REDIRECT_PATH } from 'types/CONSTANTS';
import { CreateUserObject, InputErrorTypes } from 'types/register';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H2, Paragraph } from '@maps-react/common/index';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { TextInput } from '@maps-react/form/components/TextInput';

const inputs = page.createAccountPage.inputs;
const pageCopy = page.createAccountPage;

export type FormErrorsState = Record<string, { error: InputErrorTypes }>;

type Props = {
  initialValues?: CreateUserObject;
  displayOtp?: boolean;
};

export const Register = ({ initialValues, displayOtp }: Props) => {
  const router = useRouter();
  const { setFormSummaryErrors, setSubmittedEmail, fieldErrors } =
    useErrorSummary();

  const [showOTP, setShowOTP] = useState(displayOtp ?? false);

  const [submittedValues, setSubmittedValues] = useState<CreateUserObject>();

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      const otpInput = document.getElementById(pageCopy.otpInput.key);
      if (otpInput) {
        otpInput.focus();
      }
    }, 50);

    return () => clearTimeout(focusTimeout);
  }, [showOTP]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setSubmittedValues(data);

    try {
      const response = await fetch(`/api/register/register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      setSubmittedEmail((data.mail as string) ?? null);

      if (response.error) {
        console.error('Next api route call failed', response);
        setFormSummaryErrors(response.fields ?? null);

        return;
      }

      if (response.success) {
        setFormSummaryErrors(null);

        if (data.otp) {
          router.push(SUCCESS_REDIRECT_PATH);
        } else {
          setShowOTP(true);
        }
      }
    } catch (err) {
      console.error('Error in handleSubmitUser:', err);
    }
  };

  const otpError = fieldErrors?.['otp']?.[0];

  return (
    <form
      data-testid="registerForm"
      method="POST"
      className="mt-6"
      id="registerForm"
      action="/api/register/register-user"
      noValidate
      onSubmit={(e) => onSubmit(e)}
    >
      {fieldErrors?.['page'] && (
        <div
          className="text-red-700 text-[18px] my-1"
          aria-describedby={'page'}
          data-testid={`page-error`}
        >
          {fieldErrors?.['page']?.[0]}
        </div>
      )}
      {inputs.map(({ label, key, type }) => {
        const error = fieldErrors?.[key]?.[0];

        const checkbox = type === 'checkbox';
        return (
          <Errors
            errors={error ? [error] : undefined}
            className="mb-4"
            testId={`${key}-errors`}
            key={key}
          >
            {error && (
              <div
                className="text-red-700 text-[18px] my-1"
                aria-describedby={key}
                data-testid={`${key}-error`}
              >
                {checkbox ? 'Confirmation is required' : error}
              </div>
            )}
            {checkbox ? (
              <Checkbox
                data-testid={key}
                id={key}
                className={twMerge('text-lg mt-6 max-w-4xl')}
                name={key}
                hasError={!!error}
                labelTestId={`${key}-label`}
                defaultChecked={initialValues?.[key] === 'on'}
              >
                <>
                  <span>{label}</span>
                  <span className="text-base text-gray-650 block mb-4">
                    {pageCopy.confirmCopy.part1}
                  </span>
                  <span className="text-base text-gray-650 block">
                    {pageCopy.confirmCopy.part2}
                  </span>
                </>
              </Checkbox>
            ) : (
              <TextInput
                data-testid={key}
                label={label}
                hasGlassBoxClass={true}
                className={twMerge('max-w-xl')}
                name={key}
                id={key}
                type={type}
                defaultValue={initialValues?.[key]}
                readOnly={showOTP}
              />
            )}
          </Errors>
        );
      })}

      {showOTP && (
        <>
          <H2 data-testid="otp-heading">{pageCopy.otpInput.label}</H2>
          <Errors
            errors={otpError ? [otpError] : undefined}
            className="mb-4"
            testId={`otp-errors`}
            key={pageCopy.otpInput.key}
          >
            {otpError && (
              <div
                className="text-red-700 text-[18px] my-1"
                aria-describedby={pageCopy.otpInput.key}
              >
                {otpError}
              </div>
            )}
            <Paragraph data-testid="enter-passcode-text">
              {pageCopy.otpInput.info}
              <br />
              <span data-testid="email-text">
                {submittedValues?.mail ?? initialValues?.mail}
              </span>
            </Paragraph>
            <TextInput
              data-testid={pageCopy.otpInput.key}
              label={pageCopy.otpInput.label}
              hasGlassBoxClass={true}
              className={twMerge('max-w-xl')}
              name={pageCopy.otpInput.key}
              id={pageCopy.otpInput.key}
              type={pageCopy.otpInput.type}
            />
          </Errors>
        </>
      )}
      <Button className={twMerge('mt-16')} data-testid="signupUser">
        {showOTP ? pageCopy.submitButton.label : pageCopy.nextButton.label}
      </Button>
    </form>
  );
};
