import { ReactNode, useState } from 'react';

import { useRouter } from 'next/router';

import { RadioInput } from 'components/RadioQuestion/RadioQuestion';
import { useErrorSummary } from 'hooks/useErrorSummary';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Icon, IconType } from '@maps-react/common/components/Icon';

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

    const nativeEvent = e.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (submitter?.name) {
      data[submitter.name] = submitter.value;
    }

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

  const formId = 'registerForm';

  return (
    <form
      action={formAction}
      noValidate
      method="POST"
      className={className}
      id={formId}
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

      <div className="flex flex-col items-center justify-start md:gap-4 md:flex-row mt-6">
        <Button type="submit" disabled={isPending} data-testid="submit-button">
          Continue
        </Button>
        <Button
          className="flex items-center mt-6 md:mt-0"
          variant="link"
          type="submit"
          form={formId}
          name="action"
          value="save"
          data-testid="save-button"
        >
          <Icon type={IconType.BOOKMARK} />
          {'Save and come back later'}
        </Button>
      </div>
    </form>
  );
};
