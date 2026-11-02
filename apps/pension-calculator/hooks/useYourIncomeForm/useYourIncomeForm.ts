import {
  type MouseEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { parseFrequency } from 'data/frequency';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionCalculatorPageTitle } from 'data/pageTitle';
import { frequencyOptions, yourIncomeCopy } from 'data/your-income';
import { persistJourneyJson } from 'lib/persistJourneyJson';
import {
  hasYourIncomeErrors,
  validateYourIncome,
} from 'lib/validation/yourIncome';
import type {
  OtherIncomeRow,
  YourIncomeData,
  YourIncomeErrors,
} from 'types/income';
import {
  ADD_ANOTHER_INCOME_ID,
  otherIncomeNameId,
  otherIncomeRemoveId,
} from 'utils/incomeFieldIds';
import { journeyPath } from 'utils/journeyPath';
import {
  addOtherIncomeRow,
  canAddOtherIncome,
  canRemoveOtherIncome,
  errorsAfterRemovingRow,
  removeOtherIncomeRow,
} from 'utils/otherIncomeRows';

import type { Ref as ErrorSummaryRef } from '@maps-react/form/components/ErrorSummary/ErrorSummary';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const YOUR_INCOME_API = '/api/your-income';

type Props = {
  sessionId: string;
  initialData: YourIncomeData;
  initialErrors: YourIncomeErrors;
};

export const useYourIncomeForm = ({
  sessionId,
  initialData,
  initialErrors,
}: Props) => {
  const { z } = useTranslation();
  const lang = useContextLanguage();
  const router = useRouter();
  const copy = yourIncomeCopy(z);
  const shared = journeyCopy(z);
  const options = frequencyOptions(z);
  const [data, setData] = useState<YourIncomeData>(initialData);
  const [errors, setErrors] = useState<YourIncomeErrors>(initialErrors);
  const [shouldFocusErrorSummary, setShouldFocusErrorSummary] = useState(false);
  const errorSummaryRef = useRef<ErrorSummaryRef>(null);
  const pendingFocusRef = useRef<string | null>(null);

  const showRemove = canRemoveOtherIncome(data.otherIncome.length);
  const showAdd = canAddOtherIncome(data.otherIncome.length);
  const hasErrors = hasYourIncomeErrors(errors);
  const pageTitle = pensionCalculatorPageTitle(copy.heading, z, hasErrors);

  useEffect(() => {
    if (pendingFocusRef.current) {
      document.getElementById(pendingFocusRef.current)?.focus();
      pendingFocusRef.current = null;
    }
  }, [data.otherIncome.length]);

  useEffect(() => {
    if (shouldFocusErrorSummary && hasErrors) {
      errorSummaryRef.current?.focus();
      setShouldFocusErrorSummary(false);
    }
  }, [shouldFocusErrorSummary, hasErrors, errors]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const persistAndNavigate = async (
    action: 'continue' | 'save',
    fallback: string,
  ) => {
    try {
      const result = await persistJourneyJson<YourIncomeErrors>(
        YOUR_INCOME_API,
        action,
        lang,
        sessionId,
        data,
      );
      await router.push(result.redirectPath ?? fallback);
    } catch {
      // Stay on this page if persistence fails.
    }
  };

  const updateRow = (
    index: number,
    field: keyof OtherIncomeRow,
    value: string,
  ) => {
    setData((current) => ({
      ...current,
      otherIncome: current.otherIncome.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const handleContinue = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateYourIncome(data, lang);
    if (hasYourIncomeErrors(nextErrors)) {
      setErrors(nextErrors);
      setShouldFocusErrorSummary(true);
      return;
    }

    setErrors({});
    await persistAndNavigate(
      'continue',
      journeyPath(lang, JOURNEY_PAGES.POTS_OF_MONEY, sessionId),
    );
  };

  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await persistAndNavigate(
      'save',
      journeyPath(lang, JOURNEY_PAGES.SAVE, sessionId),
    );
  };

  const handleAdd = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!showAdd) {
      return;
    }

    const next = addOtherIncomeRow(data);
    pendingFocusRef.current = otherIncomeNameId(next.otherIncome.length - 1);
    setData(next);
    try {
      await persistJourneyJson(
        YOUR_INCOME_API,
        'update',
        lang,
        sessionId,
        next,
      );
    } catch {
      // Keep the new row in client state if persistence fails.
    }
  };

  const handleRemove = async (
    event: MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();
    const remaining = data.otherIncome.length - 1;
    if (remaining <= 1) {
      pendingFocusRef.current = ADD_ANOTHER_INCOME_ID;
    } else if (index < remaining) {
      pendingFocusRef.current = otherIncomeRemoveId(index);
    } else {
      pendingFocusRef.current = otherIncomeRemoveId(remaining - 1);
    }

    const next = removeOtherIncomeRow(data, index);
    setErrors((current) => errorsAfterRemovingRow(current, index));
    setData(next);
    try {
      await persistJourneyJson(
        YOUR_INCOME_API,
        'update',
        lang,
        sessionId,
        next,
      );
    } catch {
      // Keep the remaining rows in client state if persistence fails.
    }
  };

  const otherIncomeHeading = (index: number) =>
    data.otherIncome.length === 1
      ? copy.otherIncomeGroupHeading
      : `${copy.otherIncomeGroupHeading} ${index + 1}`;

  const namePlaceholder = (index: number) =>
    index === 0 ? copy.namePlaceholderSavings : copy.namePlaceholderInvestments;

  return {
    copy,
    shared,
    options,
    lang,
    data,
    errors,
    showRemove,
    showAdd,
    hasErrors,
    pageTitle,
    errorSummaryRef,
    otherIncomeHeading,
    namePlaceholder,
    handleContinue,
    handleSave,
    handleAdd,
    handleRemove,
    updateRow,
    onGrossPayChange: (value: string) =>
      setData((current) => ({ ...current, grossPay: value })),
    onGrossPayFrequencyChange: (value: string) =>
      setData((current) => ({
        ...current,
        grossPayFrequency: parseFrequency(value),
      })),
  };
};
