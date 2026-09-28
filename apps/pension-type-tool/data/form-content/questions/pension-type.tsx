import { ListElement } from '@maps-react/common/components/ListElement';
import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const pensionProvidersList = [
  'Aberdeen Investments',
  'Aegon',
  'AJ Bell',
  'Aviva',
  'AXA',
  'Barclays',
  'Canada Life',
  'Embark',
  'Fidelity',
  'Friends Life',
  'Halifax',
  'Hargreaves Lansdown',
  'HSBC',
  'Interactive Investor',
  'Legal & General',
  'Lloyds Bank',
  'LV= (Liverpool Victoria)',
  'M&G (previously the Prudential)',
  'Moneybox',
  'NEST (National Employment Savings Trust)',
  'Novia',
  'now:pensions',
  'Nucleus',
  'Penfold',
  'PensionBee',
  'Phoenix Life',
  'Quilter',
  'ReAssure',
  'Royal Bank of Scotland',
  'Royal London',
  'RSA (Royal and Sun Alliance)',
  'St. James’s Place',
  'Scottish Friendly',
  'Scottish Widows',
  'Smart',
  'Standard Life',
  'The People’s Pension',
  'Transact',
  'Utmost',
  'Vanguard',
  'Virgin Money',
  'Wesleyan General',
  'Zurich',
];

export const pensionTypeQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: z({
        en: 'Was your pension set up by your employer?',
        cy: 'A gafodd eich pensiwn ei sefydlu gan eich cyflogwr?',
      }),
      type: 'single',
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Do' }),
        },
        {
          text: z({ en: 'No', cy: 'Na' }),
        },
        {
          text: z({ en: 'Not sure', cy: 'Ddim yn siŵr' }),
        },
      ],
    },
    {
      questionNbr: 2,
      group: '',
      title: z({
        en: 'Was that employer in the public sector?',
        cy: 'A oedd y cyflogwr hwnnw yn y sector cyhoeddus?',
      }),
      type: 'single',
      definition: z({
        en: 'This includes government services like councils, education, the NHS, the Armed Forces, social services and the emergency services.',
        cy: "Mae hyn yn cynnwys gwasanaethau'r llywodraeth fel cynghorau, addysg, y GIG, y Lluoedd Arfog, gwasanaethau cymdeithasol a’r gwasanaethau brys.",
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Do' }),
        },
        {
          text: z({ en: 'No', cy: 'Na' }),
        },
        {
          text: z({ en: 'Not sure', cy: 'Ddim yn siŵr' }),
        },
      ],
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: 'Is your pension provider listed below?',
        cy: "A yw eich darparwr pensiwn wedi'i restru isod?",
      }),
      type: 'single',
      definition: z({
        en: (
          <ListElement
            variant="unordered"
            color="blue"
            className="mb-2 ml-7"
            columns={2}
            items={pensionProvidersList}
          />
        ),
        cy: (
          <ListElement
            variant="unordered"
            color="blue"
            className="mb-2 ml-7"
            columns={2}
            items={pensionProvidersList}
          />
        ),
      }),
      description: z({
        en: 'Some of these providers might have had different names in the past. For example, Aviva used to be called Norwich Union. You can check with your provider if you’re not sure.',
        cy: 'Mae’n bosibl bod rhai o’r darparwyr hyn wedi defnyddio enwau gwahanol yn y gorffennol. Er enghraifft, roedd Aviva yn cael ei alw’n Norwich Union yn flaenorol. Os nad ydych yn siŵr, gallwch wirio gyda’ch darparwr.',
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydy' }),
        },
        {
          text: z({ en: 'No', cy: 'Na' }),
        },
        {
          text: z({ en: 'Not sure', cy: 'Ddim yn siŵr' }),
        },
      ],
    },
    {
      questionNbr: 4,
      group: '',
      title: z({
        en: 'When did you start this pension?',
        cy: 'Pryd wnaethoch chi ddechrau’r pensiwn hwn?',
      }),
      type: 'single',
      target: '/change-options',
      answers: [
        {
          text: z({ en: '1999 or before', cy: '1999 neu cyn' }),
        },
        {
          text: z({ en: '2000 or later', cy: '2000 neu’n hwyrach' }),
        },
        {
          text: z({ en: "Don't know", cy: 'Ddim yn gwybod' }),
        },
      ],
    },
  ];
};
