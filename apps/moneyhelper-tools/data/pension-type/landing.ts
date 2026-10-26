import { useTranslation } from '@maps-react/hooks/useTranslation';

export const landingText = (
  z: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    pageHeading: z({
      en: 'Find out your pension type',
      cy: 'Darganfod eich math o bensiwn',
    }),
    intro: z({
      en: 'Use our free tool to check what type of pension you have, so you can understand how it works and your options.',
      cy: 'Defnyddiwch ein teclyn am ddim i wirio pa fath o bensiwn sydd gennych, er mwyn deall sut mae’n gweithio a pha opsiynau sydd ar gael ar eich cyfer.',
    }),
    content1: z({
      en: 'Our quick and easy tool will:',
      cy: 'Bydd ein teclyn cyflym a hawdd ei ddefnyddio yn:',
    }),
    listItem1: z({
      en: 'ask you simple questions about your pension',
      cy: 'gofyn cwestiynau syml i chi am eich pensiwn.',
    }),
    listItem2: z({
      en: 'tell you the type of pension it’s likely to be.',
      cy: "dweud wrthych y math o bensiwn mae'n debygol o fod.",
    }),
    content2: z({
      en: 'You can use the tool for each of your pensions. It only takes about one minute to complete.',
      cy: "Gallwch ddefnyddio'r teclyn ar gyfer pob un o'ch pensiynau. Dim ond tua munud y mae'n ei gymryd i'w gwblhau.",
    }),
    disclaimer: z({
      en: 'This tool should be used as a guide. Your pension provider can confirm the exact type and features you have.',
      cy: 'Dylid defnyddio’r teclyn hwn fel canllaw. Gall eich darparwr pensiwn gadarnhau’n union pa fath o bensiwn sydd gennych a’i nodweddion.',
    }),
    buttonText: z({
      en: 'Find out your pension type',
      cy: 'Darganfyddwch eich math o bensiwn',
    }),
    furtherHelp: z({
      en: 'For more help and information about the different types of pensions, see our',
      cy: 'I gael rhagor o gymorth a gwybodaeth am y gwahanol fathau o bensiynau, gweler ein',
    }),
    guidesLinkText: z({
      en: 'pensions explained guides',
      cy: 'canllawiau esbonio pensiynau',
    }),
    guidesLink: z({
      en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics',
      cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics',
    }),
  };
};
