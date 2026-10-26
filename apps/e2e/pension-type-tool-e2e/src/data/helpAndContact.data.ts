export const helpAndContactData = {
  resultQuery: 'q-1=0&q-2=1&q-3=1&q-4=2',
  en: {
    questionPath: '/en/pension-type/question-1',
    liveChat: {
      text: 'Need help? Live chat with our specialists',
      linkText: 'Live chat with our specialists',
      url: 'https://www.moneyhelper.org.uk/en/contact-us',
    },
  },
  cy: {
    questionPath: '/cy/pension-type/question-1',
    liveChat: {
      text: 'Angen help? Sgwrs fyw gyda’n harbenigwyr',
      linkText: 'Sgwrs fyw gyda’n harbenigwyr',
      url: 'https://www.moneyhelper.org.uk/cy/contact-us',
    },
  },
} as const;

export type PensionTypeLanguage = keyof Omit<
  typeof helpAndContactData,
  'resultQuery'
>;
