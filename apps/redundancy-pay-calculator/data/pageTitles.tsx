import { redundancyPayCalculatorQuestions } from '../data/form-content/questions';

import useTranslation from '@maps-react/hooks/useTranslation';

export const getPageTitle = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: redundancyPayCalculatorQuestions(t)[0].title,
    2: redundancyPayCalculatorQuestions(t)[1].title,
    3: redundancyPayCalculatorQuestions(t)[2].title,
    4: redundancyPayCalculatorQuestions(t)[3].title,
    5: redundancyPayCalculatorQuestions(t)[4].title,
    6: redundancyPayCalculatorQuestions(t)[5].title,
    changeOptions: t({
      en: 'Check your answers',
      cy: 'Gwiriwch eich atebion',
    }),
    results: t({
      en: 'Your results',
      cy: 'Eich canlyniadau',
    }),

    refer: t({
      en: 'Business Debtline',
      cy: 'Llinell Ddyled Busnes',
    }),
  };
};
