import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { FormErrorsState } from 'components/Register/Register';
import { page } from 'data/pages/register';
import { CreateUserObject } from 'types/register';
import { generateSummaryErrors } from 'utils/helper/register/generateSummaryErrors/generateSummaryErrors';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

const inputs = page.createAccountPage.inputs;

interface ErrorContextType {
  setFormSummaryErrors: (errors: FormErrorsState | null) => void;
  setSubmittedEmail: (email: string | null) => void;
  errorSummarySection: ReactNode | null;
  fieldErrors: Record<string, (string | undefined)[]> | null;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(
  undefined,
);

export const ErrorSummaryProvider = ({
  children,
  initialErrors,
  initialValues,
  isRadio,
}: {
  children: (props: ErrorContextType) => ReactNode;
  initialErrors?: FormErrorsState | null;
  initialValues?: CreateUserObject;
  isRadio?: boolean;
}) => {
  const [formSummaryErrors, setFormSummaryErrors] =
    useState<FormErrorsState | null>(initialErrors ?? null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(
    initialValues?.mail ?? null,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    (string | undefined)[]
  > | null>(null);

  const errorSummarySection = useMemo(() => {
    const formErrors = formSummaryErrors
      ? generateSummaryErrors(
          formSummaryErrors,
          inputs,
          submittedEmail ?? '',
          isRadio,
        )
      : null;

    setFieldErrors(formErrors);
    return formErrors ? (
      <ErrorSummary
        title={'There is a problem'}
        errors={formErrors}
        errorKeyPrefix={''}
        classNames="mt-8 -mb-4"
      />
    ) : null;
  }, [formSummaryErrors, submittedEmail, isRadio]);

  useEffect(() => {
    if (errorSummarySection) {
      const timer = setTimeout(() => {
        const errorElement = document.getElementById('error-summary-container');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          errorElement.setAttribute('tabindex', '-1');
          errorElement.focus();
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [errorSummarySection]);

  const contextValue = useMemo(
    () => ({
      setFormSummaryErrors,
      setSubmittedEmail,
      fieldErrors,
      errorSummarySection,
    }),
    [errorSummarySection, fieldErrors],
  );

  return (
    <ErrorContext.Provider value={contextValue}>
      {children(contextValue)}
    </ErrorContext.Provider>
  );
};
