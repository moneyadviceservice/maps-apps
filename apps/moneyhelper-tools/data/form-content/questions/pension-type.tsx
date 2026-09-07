import { ListElement } from '@maps-react/common/components/ListElement';
import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const pensionTypeQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: z({
        en: 'Was your pension set up by your employer?',
        cy: 'Ydy eich pensiwn wedi cael ei sefydlu gan eich cyflogwr?',
      }),
      type: 'single',
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Do' }),
        },
        {
          text: z({ en: 'No', cy: 'Naddo' }),
        },
        {
          text: z({ en: "Don't know", cy: 'Ddim yn gwybod' }),
        },
      ],
    },
    {
      questionNbr: 2,
      group: '',
      title: z({
        en: 'Did your pension come from working for one of the following:',
        cy: 'Ydy eich pensiwn o ganlyniad i weithio i un o’r canlynol:',
      }),
      type: 'single',
      definition: z({
        en: (
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              'A local council',
              'The government',
              'A school or university',
              'The NHS',
              'The emergency services',
              'The armed forces',
              'Any other public sector employer, e.g. social services',
            ]}
          />
        ),
        cy: (
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              'Cyngor lleol',
              'Y llywodraeth',
              'Ysgol neu brif ysgol',
              'Y GIG',
              'Y gwasanaethau brys',
              'Y lluoedd arfog',
              'Unrhyw gyflogwr sector gyhoeddus arall, ee gwasanaethau cymdeithasol',
            ]}
          />
        ),
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
        {
          text: z({ en: "Don't know", cy: 'Ddim yn gwybod' }),
        },
      ],
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: 'Is your pension provider one of the following:',
        cy: "A yw eich darparwr pensiwn yn un o'r canlynol:",
      }),
      type: 'single',
      definition: z({
        en: (
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7 mb-2"
            columns={2}
            items={[
              'Aegon',
              'Allianz',
              'Aviva',
              'AXA',
              'Barclays',
              'Capita',
              'Fidelity',
              'Friends Life',
              'Halifax',
              'Hargreaves Lansdown',
              'HSBC',
              'Legal & General',
              'Lloyds Bank',
              'LV= (Liverpool Victoria)',
              'Phoenix Life',
              'Prudential',
              'NEST (National Employment Savings Trust)',
              'NOW: Pensions',
              'ReAssure',
              'Royal Bank of Scotland',
              'Royal London',
              'RSA (Royal and Sun Alliance)',
              'Scottish Life',
              'Standard Life',
              'Scottish Widows',
              "The People's Pension",
              'Virgin Money',
              'Wesleyan General',
              'Zurich',
            ]}
          />
        ),
        cy: (
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7 mb-2"
            columns={2}
            items={[
              'Aegon',
              'Allianz',
              'Aviva',
              'AXA',
              'Barclays',
              'Capita',
              'Fidelity',
              'Friends Life',
              'Halifax',
              'Hargreaves Lansdown',
              'HSBC',
              'Legal & General',
              'Lloyds Bank',
              'LV= (Liverpool Victoria)',
              'Phoenix Life',
              'Prudential',
              'NEST (National Employment Savings Trust)',
              'NOW: Pensions',
              'ReAssure',
              'Royal Bank of Scotland',
              'Royal London',
              'RSA (Royal and Sun Alliance)',
              'Scottish Life',
              'Standard Life',
              'Scottish Widows',
              "The People's Pension",
              'Virgin Money',
              'Wesleyan General',
              'Zurich',
            ]}
          />
        ),
      }),
      description: z({
        en: 'Some of these companies may have had different names in the past or have merged with other companies, e.g. Aviva used to be Norwich Union.',
        cy: "Efallai bod rhai o'r cwmniau hyn wedi cael enwau gwahanol yn y gorffenol neu wedi uno â chwmniau eraill, ee roedd Aviva yn arfer bod yn Norwich Union.",
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
        {
          text: z({ en: "Don't know", cy: 'Ddim yn gwybod' }),
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
          text: z({ en: '1995 or before', cy: '1995 neu cyn' }),
        },
        {
          text: z({ en: '1996 to 2000', cy: '1996 i 2000' }),
        },
        {
          text: z({ en: '2001 or later', cy: '2001 neu’n hwyrach' }),
        },
        {
          text: z({ en: "Don't know", cy: 'Ddim yn gwybod' }),
        },
      ],
    },
  ];
};
