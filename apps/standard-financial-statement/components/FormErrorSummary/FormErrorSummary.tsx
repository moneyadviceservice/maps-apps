import { FormType } from 'data/form-data/org_signup';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import useTranslation from '@maps-react/hooks/useTranslation';

export type FormTyeError = {
  newForm: Record<string, string[]>;
  existingForm: Record<string, string[]>;
};

export const FormErrorSummary = ({
  formMode,
  activeErrors,
}: {
  formMode: FormType;
  activeErrors: FormTyeError;
}) => {
  const { z } = useTranslation();
  let errorSummaryErrors = {};
  if (formMode === FormType.NEW_ORG && activeErrors.newForm) {
    errorSummaryErrors = activeErrors.newForm;
  } else if (
    (formMode === FormType.ACTIVE_ORG || formMode === FormType.NEW_ORG_USER) &&
    activeErrors.existingForm
  ) {
    errorSummaryErrors = activeErrors.existingForm;
  }
  return (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={errorSummaryErrors}
      errorKeyPrefix={''}
      classNames="mt-8 -mb-4"
    />
  );
};
