import {
  type MouseEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionCalculatorPageTitle } from 'data/pageTitle';
import { statePensionCopy } from 'data/state-pension';
import { persistJourneyJson } from 'lib/persistJourneyJson';
import { hasStatePensionErrors } from 'lib/validation/statePension';
import type { StatePensionErrors } from 'types/statePension';
import { journeyPath } from 'utils/journeyPath';

import type { Ref as ErrorSummaryRef } from '@maps-react/form/components/ErrorSummary/ErrorSummary';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
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
  const lang = useContextLanguage();
  const router = useRouter();
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

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const persist = async (action: 'continue' | 'save', fallback: string) => {
    try {
      const result = await persistJourneyJson<StatePensionErrors>(
        STATE_PENSION_API,
        action,
        lang,
        sessionId,
        { weeklyAmount },
      );
      if (!result.success) {
        setErrors(result.errors ?? {});
        setShouldFocusErrorSummary(true);
        return;
      }

      setErrors({});
      await router.push(result.redirectPath ?? fallback);
    } catch (error) {
      console.error('Failed to persist state pension', error);
    }
  };

  const handleContinue = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await persist(
      'continue',
      journeyPath(lang, JOURNEY_PAGES.STATE_PENSION, sessionId),
    );
  };

  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await persist('save', journeyPath(lang, JOURNEY_PAGES.SAVE, sessionId));
  };

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
