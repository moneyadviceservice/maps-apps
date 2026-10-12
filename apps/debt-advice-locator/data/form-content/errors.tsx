import { ErrorType } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const debtAdviceLocatorErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 1,
      message: z({
        en: 'Select which country you live in.',
        cy: `Dewiswch ba wlad rydych chi'n byw ynddi.`,
      }),
    },
    {
      question: 2,
      message: z({
        en: "Select yes if you are a small business owner or self-employed, or no if you're not.",
        cy: `Dewiswch ydw os ydych chi'n berchennog busnes bach neu'n hunangyflogedig, neu nac ydw os nad ydych chi.`,
      }),
    },
    {
      question: 3,
      message: z({
        en: "Select how you'd like to get debt advice - online, by phone or face-to-face",
        cy: `Dewiswch sut yr hoffech gael cyngor ar ddyledion - ar-lein, dros y ffôn neu wyneb yn wyneb`,
      }),
    },
    {
      question: 4,
      message: z({
        en: 'Enter a valid city, town or postcode to continue.',
        cy: `Rhowch ddinas, tref neu gôd post dilys i barhau.`,
      }),
    },
  ];
};
