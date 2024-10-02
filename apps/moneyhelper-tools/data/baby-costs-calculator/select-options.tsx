import { useTranslation } from '@maps-react/hooks/useTranslation';

export const monthSelectOptions = (
  z: ReturnType<typeof useTranslation>['z'],
) => {
  const monthText = z({ en: 'months', cy: 'mis' });

  return [
    { text: `0 ${monthText}`, value: '0' },
    { text: `1 ${z({ en: 'month', cy: 'mis' })}`, value: '1' },
    { text: `2 ${z({ en: 'months', cy: 'fis' })}`, value: '2' },
    { text: `3 ${monthText}`, value: '3' },
    { text: `4 ${monthText}`, value: '4' },
    { text: `5 ${monthText}`, value: '5' },
    { text: `6 ${monthText}`, value: '6' },
    { text: `7 ${monthText}`, value: '7' },
    { text: `8 ${monthText}`, value: '8' },
    { text: `9 ${monthText}`, value: '9' },
    { text: `10 ${monthText}`, value: '10' },
    { text: `11 ${monthText}`, value: '11' },
    { text: `12 ${monthText}`, value: '12' },
    { text: `13 ${monthText}`, value: '13' },
    { text: `14 ${monthText}`, value: '14' },
    { text: `15 ${monthText}`, value: '15' },
    { text: `16 ${monthText}`, value: '16' },
    { text: `17 ${monthText}`, value: '17' },
    { text: `18 ${monthText}`, value: '18' },
    { text: `19 ${monthText}`, value: '19' },
    { text: `20 ${monthText}`, value: '20' },
    { text: `21 ${monthText}`, value: '21' },
    { text: `22 ${monthText}`, value: '22' },
    { text: `23 ${monthText}`, value: '23' },
    { text: `24 ${monthText}`, value: '24' },
    { text: `25 ${monthText}`, value: '25' },
    { text: `26 ${monthText}`, value: '26' },
    { text: `27 ${monthText}`, value: '27' },
    { text: `28 ${monthText}`, value: '28' },
    { text: `29 ${monthText}`, value: '29' },
    { text: `30 ${monthText}`, value: '30' },
    { text: `31 ${monthText}`, value: '31' },
    { text: `32 ${monthText}`, value: '32' },
    { text: `33 ${monthText}`, value: '33' },
    { text: `34 ${monthText}`, value: '34' },
    { text: `35 ${monthText}`, value: '35' },
    { text: `36 ${monthText}`, value: '36' },
  ];
};

export const saveSelectOptions = (
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return [
    { text: z({ en: 'Per day', cy: 'Y dydd' }), value: '1' },
    { text: z({ en: 'Per week', cy: 'Yr wythnos' }), value: '7' },
    { text: z({ en: 'Per 2 weeks', cy: 'Am 2 wythnos' }), value: '14' },
    { text: z({ en: 'Per 4 weeks', cy: 'Fes 4 wythnosau' }), value: '28' },
    { text: z({ en: 'Per month', cy: 'Y mis' }), value: '30' },
  ];
};
