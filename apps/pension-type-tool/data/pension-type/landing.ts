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
      en: 'Use this service to check your pension type and find out if you can book a free Pension Wise appointment.',
      cy: 'Defnyddiwch y gwasanaeth hwn i wirio eich math o bensiwn a darganfod os gallwch drefnu apwyntiad Pension Wise am ddim.',
    }),
    content1: z({
      en: 'If you have a defined contribution (personal or workplace) pension, you choose how to take your money. You can then get free guidance about this from one of our pensions specialists.',
      cy: 'Os oes gennych bensiwn cyfraniadau wedi’u diffinio (personol neu gweithle) rydych chi’n dewis sut i gymryd eich arian. Yna gallwch gael arweiniad am ddim am hyn gan un o’n arbenigwyr pensiwn.',
    }),
    content2: z({
      en: 'You’ll need to check each pension separately if you have more than one.',
      cy: 'Bydd angen i chi wirio bob pensiwn ar wahân os oes gennych fwy nag un.',
    }),
    buttonText: z({
      en: 'Start now to find out your pension type',
      cy: 'Dechrau nawr i ddarganfod eich math o bensiwn',
    }),
  };
};
