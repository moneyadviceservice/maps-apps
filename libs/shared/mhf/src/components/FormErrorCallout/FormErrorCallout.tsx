import { useEffect, useRef } from 'react';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary/';
import type { Ref as ErrorSummaryRef } from '@maps-react/form/components/ErrorSummary/ErrorSummary';
import useTranslation from '@maps-react/hooks/useTranslation';

import { FormError } from '../../types';

type FormErrorCalloutProps = {
  errors?: FormError;
  step: string;
};

export const FormErrorCallout = ({ errors, step }: FormErrorCalloutProps) => {
  const { t } = useTranslation();
  const errorSummaryRef = useRef<ErrorSummaryRef>(null);

  useEffect(() => {
    errorSummaryRef.current?.focus();
  }, [errors]);

  return (
    <ErrorSummary
      ref={errorSummaryRef}
      title={t('common.error-callout.title')}
      errors={getTranslatedErrors(step, t, errors)}
    />
  );
};

/**
 * Translates the error messages for a specific step using the provided translation function.
 */
const getTranslatedErrors = (
  step: string,
  t: (key: string) => string,
  errors?: FormError,
): Record<string, string[]> => {
  return Object.fromEntries(
    Object.entries(errors ?? {}).map(([field, messages]) => [
      field,
      messages.map((message) => t(`components.${step}.form.${message}.error`)),
    ]),
  );
};
