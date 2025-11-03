import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FORM_FIELDS } from './types';

const labelClasses = ['text-[18px]'];

export const onlineQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: z({
        en: 'Customer consent',
        cy: 'Cydsyniad cwsmer',
      }),
      definition: z({
        en: (
          <>
            <Paragraph className="font-bold text-[18px] my-8">
              To make an online referral, please read the following consent
              information to the customer:
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              &apos;To send you a link to an online debt advice tool, we need
              your permission to share your name and email address with
              MoneyHelper. We will receive confirmation that the link has been
              sent to you.
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              Do you give consent for us to share your information with
              MoneyHelper?&apos;
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="font-bold text-[18px] my-8">
              I wneud cyfeiriad ar-lein, darllenwch y gwybodaeth cydsynio
              dilynol i&apos;r cwsmer:
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              &apos;I anfon dolen i declyn cyngor ar ddyledion ar-lein i chi,
              rydym angen eich caniatâd i rannu eich enw a&apos;ch cyfeiriad
              e-bost gyda HelpwrArian. Byddwn yn derbyn cadarnhad bod y dolen
              wedi cael ei hanfon atoch.
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              Ydych chi&apos;n cydsynio i ni rannu eich gwybodaeth gyda
              HelpwrArian?&apos;
            </Paragraph>
          </>
        ),
      }),
      type: 'standalone',
      subType: FORM_FIELDS.consentOnline,
      classes: labelClasses,
      errors: {
        message: z({
          en: 'Select whether the customer gives their consent or not.',
          cy: "Dewiswch a ydy'r cwsmer yn cydsynio ai peidio.",
        }),
      },
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
      questionNbr: 2,
      group: '',
      title: z({
        en: 'Your references for updates',
        cy: 'Eich cyfeiriadau am ddiweddariadau',
      }),
      definition: z({
        en: 'These references will be used for confirming that the link has been sent to your customer.',
        cy: "Bydd y cyfeiriadau hyn yn cael eu defnyddio i gadarnhau bod y ddolen wedi'i hanfon at eich cwsmer.",
      }),
      type: 'standalone',
      subType: 'reference',
      classes: labelClasses,
      answers: [],
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: "Customer's details",
        cy: 'Manylion y cwsmer',
      }),
      type: 'standalone',
      subType: 'customerDetails',
      classes: labelClasses,
      answers: [
        {
          text: z({
            en: "Customer's first name",
            cy: 'Enw cyntaf y cwsmer',
          }),
        },
        {
          text: z({
            en: "Customer's last name",
            cy: 'Cyfenw y cwsmer',
          }),
        },
        {
          text: z({
            en: "Customer's email address",
            cy: 'Cyfeiriad e-bost y cwsmer',
          }),
        },
      ],
    },
  ];
};
