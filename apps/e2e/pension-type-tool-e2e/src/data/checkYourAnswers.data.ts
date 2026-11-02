export const checkYourAnswersScenarios = {
  en: {
    language: 'English',
    startPath: '/en/pension-type/question-1',
    checkYourAnswersHeading: 'Check your answers',
    previousAnswers: [
      {
        row: 'setUpBy',
        question: 'Was your pension set up by your employer?',
        value: '0',
        answer: 'Yes',
      },
      {
        row: 'pensionComeFrom',
        question: 'Was that employer in the public sector?',
        value: '1',
        answer: 'No',
      },
      {
        row: 'pensionProvider',
        question: 'Is your pension provider listed below?',
        value: '2',
        answer: 'Not sure',
      },
    ],
    startDateQuestion: {
      row: 'pensionStartDate',
      question: 'What year was the pension set up in?',
    },
    startDateOptions: [
      { label: '1999 or before', value: '0' },
      { label: '2000 or later', value: '1' },
      { label: 'Not sure', value: '2' },
    ],
    legacyAnswers: ['2001 or later', "Don't know"],
    resultsPath: '**/pension-type/results**',
  },
  cy: {
    language: 'Welsh',
    startPath: '/cy/pension-type/question-1',
    checkYourAnswersHeading: 'Gwiriwch eich atebion',
    previousAnswers: [
      {
        row: 'setUpBy',
        question: 'A gafodd eich pensiwn ei sefydlu gan eich cyflogwr?',
        value: '0',
        answer: 'Do',
      },
      {
        row: 'pensionComeFrom',
        question: 'A oedd y cyflogwr hwnnw yn y sector cyhoeddus?',
        value: '1',
        answer: 'Na',
      },
      {
        row: 'pensionProvider',
        question: "A yw eich darparwr pensiwn wedi'i restru isod?",
        value: '2',
        answer: 'Ddim yn siŵr',
      },
    ],
    startDateQuestion: {
      row: 'pensionStartDate',
      question: 'Ym mha flwyddyn y cafodd y pensiwn ei sefydlu?',
    },
    startDateOptions: [
      { label: '1999 neu cyn', value: '0' },
      { label: '2000 neu’n ddiweddarach', value: '1' },
      { label: 'Ddim yn siŵr', value: '2' },
    ],
    legacyAnswers: ['2001 neu’n ddiweddarach', 'Ddim yn gwybod'],
    resultsPath: '**/pension-type/results**',
  },
} as const;
