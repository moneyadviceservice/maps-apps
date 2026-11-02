export const pensionStartDateScenarios = {
  en: {
    language: 'English',
    startPath: '/en/pension-type/question-1',
    browserTitle:
      'Pension Type: What year was the pension set up in? - MoneyHelper',
    heading: 'What year was the pension set up in?',
    checkYourAnswersHeading: 'Check your answers',
    options: [
      { label: '1999 or before', value: '0' },
      { label: '2000 or later', value: '1' },
      { label: 'Not sure', value: '2' },
    ],
    removedOptions: ['2001 or later', "Don't know"],
    notSureOption: 'Not sure',
  },
  cy: {
    language: 'Welsh',
    startPath: '/cy/pension-type/question-1',
    browserTitle:
      'Math o Bensiwn: Ym mha flwyddyn y cafodd y pensiwn ei sefydlu? - HelpwrArian',
    heading: 'Ym mha flwyddyn y cafodd y pensiwn ei sefydlu?',
    checkYourAnswersHeading: 'Gwiriwch eich atebion',
    options: [
      { label: '1999 neu cyn', value: '0' },
      { label: '2000 neu’n ddiweddarach', value: '1' },
      { label: 'Ddim yn siŵr', value: '2' },
    ],
    removedOptions: ['2001 neu’n ddiweddarach', 'Ddim yn gwybod'],
    notSureOption: 'Ddim yn siŵr',
  },
} as const;
