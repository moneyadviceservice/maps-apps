import { useTranslation } from '@maps-react/hooks/useTranslation';

export const pageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: t({
      en: 'Was your pension set up by your employer?',
      cy: 'A gafodd eich pensiwn ei sefydlu gan eich cyflogwr?',
    }),
    2: t({
      en: 'Was that employer in the public sector?',
      cy: 'A oedd y cyflogwr hwnnw yn y sector cyhoeddus?',
    }),
    3: t({
      en: 'Is your pension provider listed below?',
      cy: "A yw eich darparwr pensiwn wedi'i restru isod?",
    }),
    4: t({
      en: 'What year was the pension set up in?',
      cy: 'Ym mha flwyddyn y cafodd y pensiwn ei sefydlu?',
    }),
    result: t({
      en: 'Personalised action plan',
      cy: 'Cynllun gweithredu personol',
    }),
    changeAnswers: t({
      en: 'Check your answers',
      cy: 'Gwiriwch eich atebion',
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
