import { useEffect, useRef, useState } from 'react';

import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionCalculatorPageTitle } from 'data/pageTitle';
import { statePensionCopy } from 'data/state-pension';
import { useJourneyFormAction } from 'hooks/useJourneyFormAction';
import { hasStatePensionErrors } from 'lib/validation/statePension';
import type { StatePensionErrors } from 'types/statePension';

import type { Ref as ErrorSummaryRef } from '@maps-react/form/components/ErrorSummary/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const STATE_PENSION_API = '/api/state-pension';

type Props = {
  sessionId: string;
  initialWeeklyAmount: string;
  maxWeeklyAmount: string;
  initialErrors: StatePensionErrors;
};

export const useStatePensionForm = ({
  sessionId,
  initialWeeklyAmount,
  maxWeeklyAmount,
  initialErrors,
}: Props) => {
  const { z } = useTranslation();
  const copy = statePensionCopy(z, maxWeeklyAmount);
  const shared = journeyCopy(z);
  const [weeklyAmount, setWeeklyAmount] = useState(initialWeeklyAmount);
  const [errors, setErrors] = useState<StatePensionErrors>(initialErrors);
  const [shouldFocusErrorSummary, setShouldFocusErrorSummary] = useState(false);
  const errorSummaryRef = useRef<ErrorSummaryRef>(null);

  const hasErrors = hasStatePensionErrors(errors);
  const pageTitle = pensionCalculatorPageTitle(copy.heading, z, hasErrors);

  useEffect(() => {
    if (shouldFocusErrorSummary && hasErrors) {
      errorSummaryRef.current?.focus();
      setShouldFocusErrorSummary(false);
    }
  }, [shouldFocusErrorSummary, hasErrors, errors]);

  const { lang, handleContinue, handleSave } =
    useJourneyFormAction<StatePensionErrors>({
      api: STATE_PENSION_API,
      sessionId,
      pageTitle,
      continuePage: JOURNEY_PAGES.RETIREMENT_INCOME,
      body: { weeklyAmount },
      errorMessage: 'Failed to persist state pension',
      onFailure: (nextErrors) => {
        setErrors(nextErrors ?? {});
        setShouldFocusErrorSummary(true);
      },
      onSuccess: () => setErrors({}),
    });

  return {
    copy,
    shared,
    lang,
    weeklyAmount,
    setWeeklyAmount,
    errors,
    hasErrors,
    pageTitle,
    errorSummaryRef,
    handleContinue,
    handleSave,
  };
};
