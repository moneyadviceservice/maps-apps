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
import { incomePensionsCopy, pensionPotsCopy } from 'data/pensions';
import { persistJourneyJson } from 'lib/persistJourneyJson';
import {
  hasPensionErrors,
  validatePotDetails,
  validatePotScreening,
} from 'lib/validation/pensions';
import type {
  DefinedContributionPot,
  DefinedIncomeData,
  DefinedIncomeErrors,
  PensionsFlow,
  PensionStep,
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

const getDestination = (
  step: PensionStep,
  flow: PensionsFlow,
  lang: string,
  sessionId: string,
  data: PotsOfMoneyData | DefinedIncomeData,
): string => {
  if (flow === 'pots-of-money') {
    const potsData = data as PotsOfMoneyData;
    if (step === 'screening') {
      const path =
        potsData.hasPotOfMoneyPension === 'no'
          ? 'income-pensions'
          : 'pots-of-money/details';
      return journeyPath(lang, path, sessionId);
    }
    if (step === 'details') {
      return journeyPath(lang, 'pots-of-money/contributions', sessionId);
    }
    return journeyPath(lang, 'pots-of-money/summary', sessionId);
  }

  const incomeData = data as DefinedIncomeData;
  if (step === 'screening') {
    const path =
      incomeData.hasIncomePension === 'no'
        ? JOURNEY_PAGES.STATE_PENSION
        : JOURNEY_PAGES.INCOME_DETAILS;
    return journeyPath(lang, path, sessionId);
  }
  return journeyPath(lang, JOURNEY_PAGES.INCOME_SUMMARY, sessionId);
};

export const usePensionsForm = ({
  step,
  flow,
  sessionId,
  initialData,
  initialErrors,
}: {
  step: PensionStep;
  flow: PensionsFlow;
  sessionId: string;
  initialData: PotsOfMoneyData | DefinedIncomeData;
  initialErrors: PotsOfMoneyErrors | DefinedIncomeErrors;
}) => {
  const { z } = useTranslation();
  const lang = useContextLanguage();
  const router = useRouter();

  const isPotsFlow = flow === 'pots-of-money';
  const pensionPotsCopyData = pensionPotsCopy(z);
  const incomePensionsCopyData = incomePensionsCopy(z);
  const copy = isPotsFlow ? pensionPotsCopyData : incomePensionsCopyData;
  const shared = journeyCopy(z);

  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState(initialErrors);
  const errorSummaryRef = useRef<ErrorSummaryRef>(null);
  const focusRef = useRef<string | null>(null);
  const hasErrors = hasPensionErrors(errors);

  let heading = copy.contributionsHeading;

  if (step === 'screening') {
    heading = copy.screeningHeading;
  } else if (step === 'details') {
    heading = copy.detailsHeading;
  }

  const pageTitle = pensionCalculatorPageTitle(heading, z, hasErrors);

  const potCount = isPotsFlow ? (data as PotsOfMoneyData).pots?.length ?? 0 : 0;

  useEffect(() => {
    if (focusRef.current) {
      document.getElementById(focusRef.current)?.focus();
      focusRef.current = null;
    }
  }, [potCount]);

  useEffect(() => {
    if (hasErrors) errorSummaryRef.current?.focus();
  }, [hasErrors]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const persist = async (
    action: string,
    next = getDestination(step, flow, lang, sessionId, data),
  ) => {
    const result = await persistJourneyJson<
      PotsOfMoneyErrors | DefinedIncomeErrors
    >(`${PENSIONS_API}?step=${step}`, action, lang, sessionId, data, flow);
    await router.push(result.redirectPath ?? next);
  };

  const validate = (): PotsOfMoneyErrors | DefinedIncomeErrors => {
    if (isPotsFlow) {
      const potsData = data as PotsOfMoneyData;
      if (step === 'screening') return validatePotScreening(potsData);
      if (step === 'details') return validatePotDetails(potsData);
    }
    return {};
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

  const updatePot = <K extends keyof DefinedContributionPot>(
    index: number,
    field: K,
    value: DefinedContributionPot[K],
  ) => {
    if (!isPotsFlow) return;

    setData((current) => {
      const potsOfMoney = current as PotsOfMoneyData;
      return {
        ...potsOfMoney,
        pots: potsOfMoney.pots.map((pot, i) =>
          i === index ? { ...pot, [field]: value } : pot,
        ),
      };
    });
  };

  const handleAdd = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isPotsFlow) return;

    const next = addPot(data as PotsOfMoneyData);
    focusRef.current = potNameId(next.pots.length - 1);
    setData(next);
    try {
      await persistJourneyJson(
        `${PENSIONS_API}?step=${step}`,
        'update',
        lang,
        sessionId,
        next,
        flow,
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
    if (!isPotsFlow) return;

    const next = removePot(data as PotsOfMoneyData, index);
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
        flow,
      );
    } catch {
      return;
    }
  };

  return {
    copy,
    pensionPotsCopyData,
    incomePensionsCopyData,
    flow,
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
