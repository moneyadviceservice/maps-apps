import { useTranslation } from '@maps-react/hooks/useTranslation';

export const pageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: t({
      en: 'Was your pension set up by your employer?',
      cy: 'Ydy eich pensiwn wedi cael ei sefydlu gan eich cyflogwr?',
    }),
    2: t({
      en: 'Where did your pension come from?',
      cy: 'O ble y daeth eich pensiwn?',
    }),
    3: t({
      en: 'Who is your pension with?',
      cy: 'Pwy yw eich pensiwn gyda?',
    }),
    4: t({
      en: 'When did your pension start?',
      cy: 'Pryd dechreuodd eich pensiwn?',
    }),
    result: t({
      en: 'Personalised action plan',
      cy: 'Cynllun gweithredu personol',
    }),
    changeAnswers: t({
      en: 'Check answers',
      cy: 'Gwiriwch atebion',
    }),
    error: t({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb os gwelwch yn dda',
    }),
    landing: t({
      en: 'Find out your pension type',
      cy: 'Darganfod eich math o bensiwn',
    }),
  };
};
