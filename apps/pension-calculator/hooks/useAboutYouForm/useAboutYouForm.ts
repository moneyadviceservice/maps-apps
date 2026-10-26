import { type SubmitEvent, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { aboutYouCopy } from 'data/about-you';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionCalculatorPageTitle } from 'data/pageTitle';
import { persistJourneyJson } from 'lib/persistJourneyJson';
import { hasAboutYouErrors, validateAboutYou } from 'lib/validation/aboutYou';
import type { AboutYouData, AboutYouErrors } from 'types/aboutYou';
import { journeyPath } from 'utils/journeyPath';
import { parseAboutYouForm } from 'utils/parseAboutYouForm';

import type { Ref as ErrorSummaryRef } from '@maps-react/form/components/ErrorSummary/ErrorSummary';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const ABOUT_YOU_API = '/api/about-you';

type Props = {
  sessionId: string;
  initialData: AboutYouData;
  initialErrors: AboutYouErrors;
};

export const useAboutYouForm = ({
  sessionId,
  initialData,
  initialErrors,
}: Props) => {
  const { z } = useTranslation();
  const lang = useContextLanguage();
  const router = useRouter();
  const copy = aboutYouCopy(z);
  const shared = journeyCopy(z);
  const [data, setData] = useState<AboutYouData>(initialData);
  const [errors, setErrors] = useState<AboutYouErrors>(initialErrors);
  const [shouldFocusErrorSummary, setShouldFocusErrorSummary] = useState(false);
  const errorSummaryRef = useRef<ErrorSummaryRef>(null);

  const hasErrors = hasAboutYouErrors(errors);
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

  const handleContinue = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextData = parseAboutYouForm(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    setData(nextData);

    const nextErrors = validateAboutYou(nextData, lang);
    if (hasAboutYouErrors(nextErrors)) {
      setErrors(nextErrors);
      setShouldFocusErrorSummary(true);
      return;
    }

    setErrors({});
    try {
      const result = await persistJourneyJson<AboutYouErrors>(
        ABOUT_YOU_API,
        'continue',
        lang,
        sessionId,
        nextData,
      );
      if (!result.success) {
        setErrors(result.errors ?? {});
        setShouldFocusErrorSummary(true);
        return;
      }

      await router.push(
        result.redirectPath ??
          journeyPath(lang, JOURNEY_PAGES.YOUR_INCOME, sessionId),
      );
    } catch (error) {
      // Stay on this page if persistence fails.
      console.error('Failed to persist about you', error);
    }
  };

  return {
    copy,
    shared,
    lang,
    data,
    errors,
    hasErrors,
    pageTitle,
    errorSummaryRef,
    handleContinue,
  };
};
