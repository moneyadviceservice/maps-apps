export const landingPageScenarios = {
  en: {
    language: 'English',
    path: '/en/pension-type',
    pageHeading: 'Find out your pension type',
    intro:
      'Use our free tool to check what type of pension you have, so you can understand how it works and your options.',
    contentIntro: 'Our quick and easy tool will:',
    bulletTexts: [
      'ask you simple questions about your pension',
      'tell you the type of pension it’s likely to be.',
    ],
    completionText:
      'You can use the tool for each of your pensions. It only takes about one minute to complete.',
    guidanceText:
      'This tool should be used as a guide. Your pension provider can confirm the exact type and features you have.',
    guideIntro:
      'For more help and information about the different types of pensions, see our',
    guideLinkText: 'pensions explained guides',
    guideUrl:
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics',
    buttonText: 'Find out your pension type',
    questionTitle: 'Was your pension set up by your employer?',
    answerOptions: ['Yes', 'No', 'Not sure'],
    startUrl: '/en/pension-type/question-1',
  },
  cy: {
    language: 'Welsh',
    path: '/cy/pension-type',
    pageHeading: 'Darganfod eich math o bensiwn',
    intro:
      'Defnyddiwch ein teclyn am ddim i wirio pa fath o bensiwn sydd gennych, er mwyn deall sut mae’n gweithio a pha opsiynau sydd ar gael ar eich cyfer.',
    contentIntro: 'Bydd ein teclyn cyflym a hawdd ei ddefnyddio yn:',
    bulletTexts: [
      'gofyn cwestiynau syml i chi am eich pensiwn.',
      "dweud wrthych y math o bensiwn mae'n debygol o fod.",
    ],
    completionText:
      "Gallwch ddefnyddio'r teclyn ar gyfer pob un o'ch pensiynau. Dim ond tua munud y mae'n ei gymryd i'w gwblhau.",
    guidanceText:
      'Dylid defnyddio’r teclyn hwn fel canllaw. Gall eich darparwr pensiwn gadarnhau’n union pa fath o bensiwn sydd gennych a’i nodweddion.',
    guideIntro:
      'I gael rhagor o gymorth a gwybodaeth am y gwahanol fathau o bensiynau, gweler ein',
    guideLinkText: 'canllawiau esbonio pensiynau',
    guideUrl:
      'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics',
    buttonText: 'Darganfyddwch eich math o bensiwn',
    questionTitle: 'A gafodd eich pensiwn ei sefydlu gan eich cyflogwr?',
    answerOptions: ['Do', 'Na', 'Ddim yn siŵr'],
    startUrl: '/cy/pension-type/question-1',
  },
} as const;
