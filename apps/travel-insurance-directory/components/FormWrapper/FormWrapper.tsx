import { ReactNode, useState } from 'react';

import { useRouter } from 'next/router';

import { RadioInput } from 'components/RadioQuestion/RadioQuestion';
import { useErrorSummary } from 'hooks/useErrorSummary';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';

type FormWrapperProps = {
  input: RadioInput;
  formAction: string;
  nextStep?: string;
  currentPath: string;
  currentStep: string;
  className?: string;
  children: ReactNode;
};

export const FormWrapper = ({
  input,
  formAction,
  nextStep,
  currentPath,
  currentStep,
  className,
  children,
}: FormWrapperProps) => {
  const router = useRouter();
  const { setFormSummaryErrors, fieldErrors } = useErrorSummary();

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(formAction, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      if (response.error) {
        console.error('Next api route call failed', response);
        setFormSummaryErrors(response.fields ?? null);
      }

      if (response.success) {
        setFormSummaryErrors(null);

        router.push(response.nextPath ?? nextStep);
      }

      setIsPending(false);
    } catch (err) {
      setFormSummaryErrors({ [`${input.key}`]: { error: 'general_error' } });
      console.error('Error in handleSubmitUser:', err);
    }

    setIsPending(false);
  };

  const error = fieldErrors?.[input.key]?.[0];

  return (
    <form
      action={formAction}
      noValidate
      method="POST"
      className={className}
      id="registerForm"
      onSubmit={(e) => onSubmit(e)}
    >
      <input type="hidden" name={'currentPath'} value={currentPath} />
      <input type="hidden" name={'currentStep'} value={currentStep} />
      <input type="hidden" name={'field'} value={input.key} />

      <Errors
        errors={error ? [error] : undefined}
        testId={`error-${input.key}`}
        id={input.key}
      >
        {error && (
          <div
            className="text-red-700 text-[18px] my-1"
            aria-describedby={input.key}
            data-testid={`${input.key}-error`}
          >
            {error}
          </div>
        )}
        {children}
      </Errors>
      <Button
        type="submit"
        className="mt-6"
        disabled={isPending}
        data-testid="submit-button"
      >
        Continue
      </Button>
    </form>
  );
};
