import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FORM_GROUPS } from './types';

const labelClasses = ['text-[18px]'];
const listClassNames = 'ml-4 pl-4 mb-6 space-y-4';

export const telephoneQuestions = (
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
              To make a telephone referral, please read the following consent
              information to the customer:
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              &apos;To refer you for telephone debt advice, we need your consent
              to share your name, email address, and phone number with
              MoneyHelper. MoneyHelper will then forward this information to a
              debt adviser within the Money Adviser Network.
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              Do you consent to us sharing your name, telephone number, and
              email address (if applicable) with MoneyHelper to process your
              telephone debt advice referral?&apos;
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="font-bold text-[18px] my-8">
              I wneud cyfeiriad ffôn, darllenwch y wybodaeth cydsynio dilynol
              i&apos;r cwsmer:
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              &apos;I&apos;ch cyfeirio am gyngor ar ddyledion dros y ffôn, rydym
              angen eich cydsyniad i rannu eich enw, cyfeiriad e-bost, a rhif
              ffôn gyda HelpwrArian. Bydd HelpwrArian wedyn yn anfon y wybodaeth
              hyn ymlaen at gynghorydd dyled o fewn y Rhwydwaith Cynghorwyr
              Ariannol.
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              Ydych chi&apos;n cydsynio i ni rannu eich enw, rhif ffôn, a
              chyfeiriad e-bost (os yw&apos;n berthnasol) gyda HelpwrArian i
              brosesu eich cyfeiriad cyngor ar ddyledion dros y ffôn?&apos;
            </Paragraph>
          </>
        ),
      }),
      type: 'standalone',
      subType: FORM_GROUPS.consentDetails,
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
        en: 'Customer consent',
        cy: 'Cydsyniad cwsmer',
      }),
      definition: z({
        en: (
          <>
            <Paragraph className="font-bold text-[18px] my-8">
              Please read the following consent information to the customer:
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              &apos;With your permission, we can get an update on the first
              outcome of your referral. This will only tell us if you have gone
              ahead with the referral, whether you have received debt advice and
              which debt advice organisation you spoke to. We will not receive
              any details from MoneyHelper about the advice you received or what
              next steps you are taking, if any.
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              Do you give permission for us to receive an update on the outcome
              of this referral?&apos;
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="font-bold text-[18px] my-8">
              Darllenwch y wybodaeth ganlynol am gydsyniad i&apos;r cwsmer:
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              &apos;Gyda&apos;ch caniatâd, gallwn gael diweddariad ar ganlyniad
              cyntaf eich cyfeiriad. Bydd hwn ond yn dweud wrthym os ydych wedi
              parhau gyda&apos;r cyfeiriad, os ydych wedi derbyn cyngor ar
              ddyledion a pha sefydliad cyngor ar ddyledion y gwnaethoch siarad
              â nhw. Ni fyddem yn derbyn unrhyw fanylion gan HelpwrArian am y
              cyngor wnaethoch ei dderbyn neu pa gamau nesaf rydych yn eu
              cymryd, os oes.
            </Paragraph>
            <Paragraph className="text-[18px] mb-8">
              Ydych chi&apos;n rhoi caniatâd i ni dderbyn diweddariad ar
              ganlyniad y cyfeiriad hwn?&apos;
            </Paragraph>
          </>
        ),
      }),
      type: 'standalone',
      subType: FORM_GROUPS.consentReferral,
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
      questionNbr: 3,
      group: '',
      title: z({
        en: 'Your references for updates',
        cy: 'Eich cyfeiriadau am ddiweddariadau',
      }),
      definition: z({
        en: 'These references will be used by your organisation to track and report the initial outcome of the referral.',
        cy: 'Caiff y cyfeiriadau hyn eu defnyddio gan eich sefydliad i olrhain ac adrodd canlyniad cychwynnol y cyfeiriad.',
      }),
      type: 'standalone',
      subType: FORM_GROUPS.reference,
      classes: labelClasses,
      answers: [],
    },
    {
      questionNbr: 4,
      group: '',
      title: z({
        en: 'When would the customer like to speak to someone?',
        cy: "Pryd fyddai'r cwsmer yn hoffi siarad â rhywun?",
      }),
      definition: z({
        en: (
          <>
            <Paragraph className="my-4">Please ensure the customer:</Paragraph>
            <ListElement
              items={[
                'Is available to speak for up to one hour',
                'Has details of all their debts to hand',
                'Can outline their income and expenditure',
              ]}
              color="blue"
              variant="unordered"
              className={listClassNames}
            />
          </>
        ),
        cy: (
          <>
            <Paragraph className="my-4">
              Gwnewch yn siŵr bod y cwsmer:
            </Paragraph>
            <ListElement
              items={[
                'Ar gael i siarad am hyd at 1 awr',
                'Gyda manylion am eu holl ddyledion wrth law',
                "Yn gallu amlinellu eu hincwm a'u gwariant",
              ]}
              color="blue"
              variant="unordered"
              className={listClassNames}
            />
          </>
        ),
      }),
      type: 'single',
      subType: 't-4',
      classes: labelClasses,
      answers: [
        {
          text: z({
            en: 'Get an immediate call back',
            cy: 'Cael galwad yn ôl ar unwaith',
          }),
          subtext: z({
            en: 'This service is only available on Monday - Friday between 9.00am and 3.30pm. Before confirming, ensure that the customer is able to answer the call within the next few minutes.',
            cy: "Mae'r gwasanaeth hwn ar gael o ddydd Llun i ddydd Gwener rhwng 9:00am a 3:30pm yn unig. Cyn cadarnhau, gwnewch yn siŵr bod y cwsmer yn gallu ateb yr alwad o fewn y munudau nesaf",
          }),
        },
        {
          text: z({
            en: 'Schedule a call for later',
            cy: 'Trefnu galwad yn y dyfodol',
          }),
          subtext: z({
            en: 'This service has slots available over the next four working days in the Morning (9am to 12pm) or Afternoon (1pm to 4pm).',
            cy: 'Dros y pedwar diwrnod gwaith nesaf, mae slotiau ar gael yn y Bore (9am i 12pm) neu yn y Prynhawn (1pm i 4pm). ',
          }),
        },
      ],
    },
    {
      questionNbr: 5,
      group: '',
      title: z({
        en: "Select customer's preferred time slot",
        cy: "Dewiswch slot amser a fyddai'n well gan y cwsmer",
      }),
      definition: z({
        en: (
          <>
            <Paragraph className="my-4">Please ensure the customer:</Paragraph>
            <ListElement
              items={[
                'Is available to speak for up to one hour',
                'Has details of all their debts to hand',
                'Can outline their income and expenditure',
              ]}
              color="blue"
              variant="unordered"
              className={listClassNames}
            />
            <Paragraph className="my-4">
              A specific time cannot be given, the customer will receive a call
              within the times shown.
            </Paragraph>
            <Heading className="my-4" level={'h4'} component={'h2'}>
              Please select the preferred time slot for the call over the next 4
              days (subject to availability):
            </Heading>
          </>
        ),
        cy: (
          <>
            <Paragraph className="my-4">
              Cadarnhewch gyda&apos;r cwsmer:
            </Paragraph>
            <ListElement
              items={[
                'Ar gael i siarad am hyd at 1 awr',
                'Gyda manylion am eu holl ddyledion wrth law',
                "Yn gallu amlinellu eu hincwm a'u gwariant",
              ]}
              color="blue"
              variant="unordered"
              className={listClassNames}
            />
            <Paragraph className="my-4">
              Ni ellir rhoi amser penodol, bydd y cwsmer yn derbyn galwad o fewn
              yr amseroedd a ddangosir.
            </Paragraph>
            <Heading className="my-4" level={'h4'} component={'h2'}>
              Dewiswch y slot amser a fyddai&apos;n well ar gyfer yr alwad dros
              y 4 diwrnod nesaf (yn amodol ar argaeledd):
            </Heading>
          </>
        ),
      }),
      type: 'single',
      classes: labelClasses,
      answers: [],
    },
    {
      questionNbr: 6,
      group: '',
      title: z({
        en: "Customer's details",
        cy: 'Manylion y cwsmer',
      }),
      type: 'standalone',
      subType: FORM_GROUPS.customerDetails,
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
            en: "Customer's telephone number",
            cy: 'Rhif ffôn y cwsmer',
          }),
        },
      ],
    },
    {
      questionNbr: 7,
      group: '',
      title: z({
        en: 'Security questions',
        cy: 'Cwestiynau diogelwch',
      }),
      description: z({
        en: `The debt adviser will use these questions to verify your customer's identify. Please ask your customer to provide their postcode and to answer one of the security questions.`,
        cy: `Bydd yr ymgynghorydd dyledion yn defnyddio'r cwestiynau hyn i wirio pwy yw eich cwsmer. Gofynnwch i'ch cwsmer ddarparu ei god post ac ateb un o'r cwestiynau diogelwch.`,
      }),
      type: 'standalone',
      subType: FORM_GROUPS.securityQuestions,
      classes: labelClasses,
      answers: [
        {
          text: z({
            en: 'In what city were you born?',
            cy: 'Yn pa ddinas y cawsoch eich geni?',
          }),
          value: 'city',
        },
        {
          text: z({
            en: `What is your mother's maiden name?`,
            cy: `Beth yw enw priodas eich mam?`,
          }),
          value: 'maiden',
        },
        {
          text: z({
            en: `What was the name of your first pet?`,
            cy: `Beth oedd enw eich anifail cyntaf?`,
          }),
          value: 'pet',
        },
        {
          text: z({
            en: `What was the name of your first school?`,
            cy: `Beth oedd enw eich ysgol gyntaf?`,
          }),
          value: 'school',
        },
      ],
    },
  ];
};
