import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const labelClasses = ['text-[18px]'];

export const startQuestions = (
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
      classes: labelClasses,
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
        en: 'Does the customer live in England?',
        cy: 'Ydy’r cwsmer yn byw yn Lloegr? ',
      }),
      type: 'single',
      subType: 'yesNo',
      classes: labelClasses,
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
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
      classes: labelClasses,
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
      ],
    },
    {
      questionNbr: 4,
      group: '',
      title: z({
        en: 'How would the customer like to get debt advice?',
        cy: "Sut y byddai'r cwsmer yn hoffi cael cyngor ar ddyledion?",
      }),
      type: 'single',
      subType: '',
      classes: labelClasses,
      answers: [
        {
          text: z({ en: 'Online', cy: 'Ar-lein' }),
          subtext: z({
            en: 'Get help from a trusted debt advice partner online.',
            cy: 'Cael help gan bartner cyngor dyled dibynadwy ar-lein.',
          }),
        },
        {
          text: z({ en: 'Telephone', cy: 'Ffôn' }),
          subtext: z({
            en: 'Arrange a call with a specialist debt adviser.',
            cy: 'Trefnu galwad gyda chynghorydd dyled arbenigol.',
          }),
        },
        {
          text: z({ en: 'Face to face', cy: 'Wyneb i wyneb' }),
          subtext: z({
            en: 'Speak to someone in person at a debt advice service close to them.',
            cy: 'Siarad â rhywun yn bersonol o wasanaeth cyngor ar ddyled yn lleol iddynt.',
          }),
        },
      ],
    },
  ];
};
