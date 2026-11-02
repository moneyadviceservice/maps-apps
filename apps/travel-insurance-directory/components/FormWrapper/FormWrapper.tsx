import { ReactNode, useState } from 'react';

import { useRouter } from 'next/router';

import { FormPage } from 'components/form/FormPage/FormPage';
import { RadioInput } from 'components/form/RadioQuestion';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler/createSubmitHandler';

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

  const onSubmit = createSubmitHandler({
    apiUrl: formAction,
    nextStep: nextStep,
    fallbackErrorKey: input.key,
    setIsPending,
    setFormSummaryErrors,
    router,
  });

  const error = fieldErrors?.[input.key]?.[0];

  const formId = 'registerForm';

  return (
    <FormPage
      submitAction={(e) => onSubmit(e)}
      nonJsSubmitFallback={formAction}
      isPending={isPending}
      formName={formId}
      className={className}
      showSaveButton={true}
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
    </FormPage>
  );
};
