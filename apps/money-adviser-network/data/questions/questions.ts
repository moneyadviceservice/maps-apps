import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Question } from '@maps-react/form/types';

export const questions = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: z({
        en: 'What does the customer need?',
        cy: 'Beth sydd ei angen ar y cwsmer?',
      }),
      type: 'single',
      subType: '',
      answers: [
        {
          text: z({ en: 'Money management help', cy: 'Help rheoli arian' }),
          subtext: z({
            en: 'Help with day-to-day money management through online tools and guidance.',
            cy: 'Help gyda rheoli arian o ddydd i ddydd drwy declynnau ac arweiniad ar-lein.',
          }),
        },
        {
          text: z({ en: 'Debt advice', cy: 'Cyngor ar ddyledion' }),
          subtext: z({
            en: 'Get personalised help on how to manage debt.',
            cy: 'Cael help personol ar sut i reoli dyled.',
          }),
        },
      ],
    },
    {
      questionNbr: 2,
      group: '',
      title: z({
        en: 'Where does the customer live?',
        cy: "Ble mae'r cwsmer yn byw?",
      }),
      type: 'single',
      subType: '',
      answers: [
        {
          text: z({ en: 'England', cy: 'Lloegr' }),
        },
        {
          text: z({ en: 'Scotland', cy: 'Yr Alban' }),
        },
        {
          text: z({ en: 'Wales', cy: 'Cymru' }),
        },
        {
          text: z({ en: 'Northern Ireland', cy: 'Gogledd Iwerddon' }),
        },
      ],
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: 'Is the customer self-employed or are they a company director?',
        cy: "A yw'r cwsmer yn hunangyflogedig neu a yw'n gyfarwyddwr cwmni?",
      }),
      type: 'single',
      subType: 'yesNo',
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
      ],
    },
  ];
};
