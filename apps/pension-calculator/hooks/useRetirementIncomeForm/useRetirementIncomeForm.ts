import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionCalculatorPageTitle } from 'data/pageTitle';
import { retirementIncomeCopy } from 'data/retirement-income';
import { frequencyOptions } from 'data/your-income';
import { useJourneyFormAction } from 'hooks/useJourneyFormAction';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export const RETIREMENT_INCOME_API = '/api/retirement-income';

export const useRetirementIncomeForm = (sessionId: string) => {
  const { z } = useTranslation();
  const copy = retirementIncomeCopy(z);
  const shared = journeyCopy(z);
  const frequencies = frequencyOptions(z);
  const pageTitle = pensionCalculatorPageTitle(copy.heading, z);
  const { lang, handleContinue, handleSave } = useJourneyFormAction({
    api: RETIREMENT_INCOME_API,
    sessionId,
    pageTitle,
    continuePage: JOURNEY_PAGES.RETIREMENT_INCOME,
    body: {},
    errorMessage: 'Failed to continue from retirement income',
  });

  return {
    copy,
    shared,
    frequencies,
    lang,
    pageTitle,
    handleContinue,
    handleSave,
  };
};
