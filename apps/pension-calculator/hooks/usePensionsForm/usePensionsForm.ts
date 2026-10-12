import {
  type MouseEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { journeyCopy } from 'data/journey';
import { pensionCalculatorPageTitle } from 'data/pageTitle';
import { pensionsCopy } from 'data/pensions';
import type { PensionStep } from 'lib/handlePensionsAction';
import { persistJourneyJson } from 'lib/persistJourneyJson';
import {
  hasPensionErrors,
  validateContributions,
  validatePotDetails,
  validatePotScreening,
} from 'lib/validation/pensions';
import type {
  DefinedContributionPot,
  PotsOfMoneyData,
  PotsOfMoneyErrors,
} from 'types/pensions';
import { addPot, errorsAfterRemovingPot, removePot } from 'utils/dcPotRows';
import { journeyPath } from 'utils/journeyPath';
import { ADD_PENSION_ID, potNameId, potRemoveId } from 'utils/pensionFieldIds';

import type { Ref as ErrorSummaryRef } from '@maps-react/form/components/ErrorSummary/ErrorSummary';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const PENSIONS_API = '/api/pensions';
const destination = (
  step: PensionStep,
  lang: string,
  sessionId: string,
  data: PotsOfMoneyData,
) => {
  const screeningPath =
    data.hasPotOfMoneyPension === 'no'
      ? 'income-pensions'
      : 'pots-of-money/details';

  let destinationPath: string;

  if (step === 'screening') {
    destinationPath = journeyPath(lang, screeningPath, sessionId);
  } else if (step === 'details') {
    destinationPath = journeyPath(
      lang,
      'pots-of-money/contributions',
      sessionId,
    );
  } else {
    destinationPath = journeyPath(lang, 'pots-of-money/summary', sessionId);
  }

  return destinationPath;
};

export const usePensionsForm = ({
  step,
  sessionId,
  initialData,
  initialErrors,
}: {
  step: PensionStep;
  sessionId: string;
  initialData: PotsOfMoneyData;
  initialErrors: PotsOfMoneyErrors;
}) => {
  const { z } = useTranslation();
  const lang = useContextLanguage();
  const router = useRouter();
  const copy = pensionsCopy(z);
  const shared = journeyCopy(z);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState(initialErrors);
  const errorSummaryRef = useRef<ErrorSummaryRef>(null);
  const focusRef = useRef<string | null>(null);
  const hasErrors = hasPensionErrors(errors);
  let heading: string;

  if (step === 'screening') {
    heading = copy.screeningHeading;
  } else if (step === 'details') {
    heading = copy.detailsHeading;
  } else {
    heading = copy.contributionsHeading;
  }

  const pageTitle = pensionCalculatorPageTitle(heading, z, hasErrors);
  useEffect(() => {
    if (focusRef.current) {
      document.getElementById(focusRef.current)?.focus();
      focusRef.current = null;
    }
  }, [data.pots.length]);
  useEffect(() => {
    if (hasErrors) errorSummaryRef.current?.focus();
  }, [hasErrors]);
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  const persist = async (
    action: string,
    next = destination(step, lang, sessionId, data),
  ) => {
    const result = await persistJourneyJson<PotsOfMoneyErrors>(
      `${PENSIONS_API}?step=${step}`,
      action,
      lang,
      sessionId,
      data,
    );
    await router.push(result.redirectPath ?? next);
  };
  const validate = () => {
    if (step === 'screening') {
      return validatePotScreening(data);
    }

    if (step === 'details') {
      return validatePotDetails(data);
    }

    return validateContributions(data);
  };
  const handleContinue = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    if (hasPensionErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    try {
      await persist('continue');
    } catch {
      return;
    }
  };
  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await persist('save', journeyPath(lang, 'save', sessionId));
    } catch {
      return;
    }
  };
  const updatePot = (
    index: number,
    field: keyof DefinedContributionPot,
    value: string,
  ) =>
    setData((current) => ({
      ...current,
      pots: current.pots.map((pot, i) =>
        i === index ? { ...pot, [field]: value } : pot,
      ),
    }));
  const handleAdd = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const next = addPot(data);
    focusRef.current = potNameId(next.pots.length - 1);
    setData(next);
    try {
      await persistJourneyJson(
        `${PENSIONS_API}?step=${step}`,
        'update',
        lang,
        sessionId,
        next,
      );
    } catch {
      return;
    }
  };
  const handleRemove = async (
    event: MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();
    const next = removePot(data, index);
    focusRef.current =
      next.pots.length === 1
        ? ADD_PENSION_ID
        : potRemoveId(Math.min(index, next.pots.length - 1));
    setErrors((current) => errorsAfterRemovingPot(current, index));
    setData(next);
    try {
      await persistJourneyJson(
        `${PENSIONS_API}?step=${step}`,
        'update',
        lang,
        sessionId,
        next,
      );
    } catch {
      return;
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
    handleSave,
    handleAdd,
    handleRemove,
    updatePot,
    setData,
  };
};
