import { Paragraph } from '@maps-react/common/components/Paragraph';
import { H4 } from '@maps-react/common/index';
import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const redundancyPayCalculatorQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [
    {
      questionNbr: 1,
      group: 'Region',
      title: z({
        en: 'Where in the UK do you live?',
        cy: `Ble yn y DU ydych chi'n byw?`,
      }),
      definition: z({
        en: 'What you’re entitled to can change depending on where you live.',
        cy: `Gall yr hyn y mae gennych hawl iddo newid gan ddibynnu ar ble rydych chi'n byw.`,
      }),
      type: 'single',
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
      questionNbr: 2,
      group: '',
      title: z({
        en: 'What is your date of birth?',
        cy: `Beth yw eich dyddiad geni?`,
      }),
      type: 'date',
      subType: 'dayMonthYear',
      definition: z({
        en: `Your age during each year of employment can change how much redundancy pay you'll get.`,
        cy: `Gall eich oedran yn ystod pob blwyddyn o gyflogaeth newid faint o dâl diswyddo y byddwch chi'n ei gael.`,
      }),
      hintText: z({
        en: 'For example, 27 3 1985',
        cy: 'Er enghraifft, 27 3 1985 ',
      }),
      answers: [],
      inputProps: {
        additionalLabels: {
          label1: z({ en: 'Day', cy: 'Diwrnod' }),
          label2: z({ en: 'Month', cy: 'Mis' }),
          label3: z({ en: 'Year', cy: 'Blwyddyn' }),
        },
      },
      hasGlassBoxClass: true,
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: 'When will you be made redundant?',
        cy: `Pryd fyddwch chi'n cael eich diswyddo?`,
      }),
      type: 'date',
      subType: 'monthYear',
      definition: z({
        en: "You can also put a date from earlier this year if you've already been made redundant.",
        cy: 'Gallwch hefyd roi dyddiad yn y gorffennol os ydych eisoes wedi cael eich diswyddo.',
      }),
      hintText: z({
        en: 'For example, 3 2025',
        cy: 'Er enghraifft, 3 2025',
      }),
      answers: [],
      inputProps: {
        additionalLabels: {
          label2: z({ en: 'Month', cy: 'Mis' }),
          label3: z({ en: 'Year', cy: 'Blwyddyn' }),
        },
      },
    },
    {
      questionNbr: 4,
      group: '',
      title: z({
        en: 'When did you start working with your current employer?',
        cy: `Pryd wnaethoch chi ddechrau gweithio gyda'ch cyflogwr presennol?`,
      }),
      type: 'date',
      subType: 'monthYear',
      definition: z({
        en: 'Employees are usually entitled to statutory redundancy pay if they’ve worked for their current employer for at least 2 years.',
        cy: 'Gallwch hefyd roi dyddiad yn y gorffennol os ydych eisoes wedi cael eich diswyddo.',
      }),
      hintText: z({
        en: 'For example, 3 2020',
        cy: 'Er enghraifft, 3 2020',
      }),
      answers: [],
      inputProps: {
        labelValue: z({ en: 'Month', cy: 'Month' }),
        additionalLabels: {
          label2: z({ en: 'Month', cy: 'Mis' }),
          label3: z({ en: 'Year', cy: 'Blwyddyn' }),
        },
      },
    },
    {
      questionNbr: 5,
      group: '',
      title: z({
        en: 'What is your income before tax?',
        cy: `Beth yw eich incwm cyn treth?`,
      }),
      type: 'moneyInput',
      subType: 'inputFrequency',
      definition: z({
        en: 'Your income is used to work out what you might be owed. Enter your gross income (before tax) and we’ll do the rest.',
        cy: 'Mae eich incwm yn cael ei ddefnyddio i weithio allan beth allai fod yn ddyledus i chi. Rhowch eich incwm gros (cyn treth) a byddwn yn gwneud y gweddill.',
      }),
      answers: [
        {
          text: z({ en: 'Yearly', cy: 'Blynyddol' }),
          value: '0',
        },
        {
          text: z({ en: 'Monthly', cy: 'Misol' }),
          value: '1',
        },
        {
          text: z({ en: 'Weekly', cy: 'Wythnosol' }),
          value: '2',
        },
      ],
      inputProps: {
        maxLimit: 999999999,
        labelValue: z({ en: 'Salary', cy: 'Cyflog' }),
        additionalLabels: {
          label1: z({ en: 'Frequency', cy: 'Amlder' }),
        },
      },
    },
    {
      questionNbr: 6,
      group: '',
      title: z({
        en: 'Will you be getting contractual redundancy pay?',
        cy: `A fyddwch chi'n cael tâl diswyddo cytundebol?`,
      }),
      type: 'single',
      subType: 'yesNoDontKnow',
      definition: z({
        en: (
          <>
            <Paragraph className="my-4">
              Your employer might pay you extra money on top of the statutory
              amount you’re entitled to. This is called “contractual” or
              “enhanced” redundancy pay.
            </Paragraph>
            <Paragraph className="my-4">
              Check your contract to see what it says about redundancy pay.
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph className="my-4">
              Efallai y bydd eich cyflogwr yn talu arian ychwanegol i chi ar ben
              y swm statudol y mae gennych hawl iddo. Gelwir hyn yn dâl diswyddo
              'cytundebol' neu 'uwch'.
            </Paragraph>
            <Paragraph className="my-4">
              Gwiriwch eich contract i weld beth mae'n ei ddweud am dâl
              diswyddo. 
            </Paragraph>
          </>
        ),
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Na' }),
          subtext: z({
            en: 'or',
            cy: 'neu',
          }),
        },
        {
          text: z({ en: `I don't know`, cy: 'Dwi ddim yn gwybod' }),
        },
      ],
      calloutData: (
        <>
          <H4>
            {z({
              en: 'Up to £30,000 redundancy pay is tax free',
              cy: 'Mae hyd at £30,000 o dâl diswyddo yn ddi-dreth',
            })}
          </H4>

          <Paragraph className="mt-4 mb-8">
            {z({
              en: 'Example:',
              cy: 'Enghraifft:',
            })}
          </Paragraph>

          <Paragraph className="mt-4 mb-8">
            {z({
              en: `Kirandeep receives a redundancy lump sum of £32,000. She also gets
              to keep her company car, which is valued at £8,000.`,
              cy: `Mae Kirandeep yn derbyn cyfandaliad diswyddo gwerth £32,000. Mae hi hefyd yn cael cadw ei char cwmni, sy'n werth £8,000`,
            })}
          </Paragraph>

          <Paragraph className="mt-4 mb-8">
            {z({
              en: 'The value of the car is added to the redundancy payment – making £40,000.',
              cy: 'Mae gwerth y car yn cael ei ychwanegu at y tâl diswyddo – gan ei wneud yn £40,000.',
            })}
          </Paragraph>

          <Paragraph className="mt-4">
            {z({
              en: 'Only £30,000 is tax free. So Kirandeep will pay tax on the remaining £10,000.',
              cy: `Dim ond £30,000 sy'n ddi-dreth. Felly bydd Kirandeep yn talu treth ar y £10,000 sy'n weddill.`,
            })}
          </Paragraph>
        </>
      ),
    },
    {
      questionNbr: 7,
      target: '/change-options',
      group: '',
      title: z({
        en: 'How much contractual redundancy pay will you receive?',
        cy: `Faint o dâl diswyddo cytundebol y byddwch chi'n ei dderbyn?`,
      }),
      type: 'moneyInput',
      subType: 'inputCheckbox',
      inputProps: {
        maxLimit: 999999999,
        labelValue: z({ en: 'Amount', cy: 'Swm' }),
      },
      hintText: z({
        en: 'or',
        cy: 'or',
      }),
      answers: [
        {
          text: z({ en: `I don't know`, cy: 'Dwi ddim yn gwybod' }),
          value: '1',
          subtext: z({
            en: 'Check your employment contract or staff handbook to find out about your contractual redundancy pay. You can also ask your employer for the amount.',
            cy: `Edrychwch ar eich contract cyflogaeth neu'ch llawlyfr staff i gael gwybod am eich tâl diswyddo cytundebol. Gallwch hefyd ofyn i'ch cyflogwr am y swm.`,
          }),
        },
      ],
    },
  ];
};
