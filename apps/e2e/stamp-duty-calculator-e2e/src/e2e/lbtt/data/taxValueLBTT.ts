export interface TaxData {
  tax: string;
  rate: string;
  day: string;
  month: string;
  year: string;
}

type ScenarioKey =
  | 'firstTimeBuyer7750'
  | 'firstTimeBuyer125000'
  | 'firstTimeBuyer275000'
  | 'firstTimeBuyer310000'
  | 'firstTimeBuyer490000'
  | 'firstTimeBuyer937000'
  | 'firstTimeBuyer988882'
  | 'firstTimeBuyer2100000'
  | 'nextHomeBuyer38449'
  | 'nextHomeBuyer275000'
  | 'nextHomeBuyer310000'
  | 'nextHomeBuyer490000'
  | 'nextHomeBuyer937000'
  | 'nextHomeBuyer2100000'
  | 'secondHomeBuyer39000'
  | 'secondHomeBuyer40000'
  | 'secondHomeBuyer125000'
  | 'secondHomeBuyer275000'
  | 'secondHomeBuyer310000'
  | 'secondHomeBuyer490000'
  | 'secondHomeBuyer937000'
  | 'secondHomeBuyer2100000'
  | 'secondHomeBuyer62000000'
  | 'secondHomeBuyer1000000000'
  | 'secondHomeBuyer1234567890';

interface LocaleData {
  [locale: string]: Record<ScenarioKey, TaxData>;
}

const taxValueLBTT: LocaleData = {
  en: {
    firstTimeBuyer7750: {
      tax: '£0.00',
      rate: 'Effective tax rate is 0.00%',
      day: '11',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer125000: {
      tax: '£0.00',
      rate: 'Effective tax rate is 0.00%',
      day: '31',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer275000: {
      tax: '£2,750.00',
      rate: 'Effective tax rate is 1.00%',
      day: '06',
      month: '04',
      year: '2023',
    },
    firstTimeBuyer310000: {
      tax: '£4,500.00',
      rate: 'Effective tax rate is 1.45%',
      day: '06',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer490000: {
      tax: '£21,750.00',
      rate: 'Effective tax rate is 4.44%',
      day: '05',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer937000: {
      tax: '£70,190.00',
      rate: 'Effective tax rate is 7.49%',
      day: '31',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer988882: {
      tax: '£76,416.00',
      rate: 'Effective tax rate is 7.73%',
      day: '11',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer2100000: {
      tax: '£209,750.00',
      rate: 'Effective tax rate is 9.99%',
      day: '23',
      month: '12',
      year: '2023',
    },
    nextHomeBuyer38449: {
      tax: '£0.00',
      rate: 'Effective tax rate is 0.00%',
      day: '04',
      month: '12',
      year: '2024',
    },
    nextHomeBuyer275000: {
      tax: '£3,350.00',
      rate: 'Effective tax rate is 1.22%',
      day: '06',
      month: '04',
      year: '2023',
    },
    nextHomeBuyer310000: {
      tax: '£5,100.00',
      rate: 'Effective tax rate is 1.65%',
      day: '31',
      month: '10',
      year: '2025',
    },
    nextHomeBuyer490000: {
      tax: '£22,350.00',
      rate: 'Effective tax rate is 4.56%',
      day: '03',
      month: '12',
      year: '2024',
    },
    nextHomeBuyer937000: {
      tax: '£70,790.00',
      rate: 'Effective tax rate is 7.55%',
      day: '11',
      month: '12',
      year: '2024',
    },
    nextHomeBuyer2100000: {
      tax: '£210,350.00',
      rate: 'Effective tax rate is 10.02%',
      day: '12',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer39000: {
      tax: '£0.00',
      rate: 'Effective tax rate is 0.00%',
      day: '05',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer40000: {
      tax: '£3,200.00',
      rate: 'Effective tax rate is 8.00%',
      day: '31',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer125000: {
      tax: '£10,000.00',
      rate: 'Effective tax rate is 8.00%',
      day: '24',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer275000: {
      tax: '£25,350.00',
      rate: 'Effective tax rate is 9.22%',
      day: '01',
      month: '01',
      year: '2025',
    },
    secondHomeBuyer310000: {
      tax: '£23,700.00',
      rate: 'Effective tax rate is 7.65%',
      day: '06',
      month: '04',
      year: '2023',
    },
    secondHomeBuyer490000: {
      tax: '£51,750.00',
      rate: 'Effective tax rate is 10.56%',
      day: '13',
      month: '12',
      year: '2023',
    },
    secondHomeBuyer937000: {
      tax: '£145,750.00',
      rate: 'Effective tax rate is 15.55%',
      day: '31',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer2100000: {
      tax: '£336,350.00',
      rate: 'Effective tax rate is 16.02%',
      day: '04',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer62000000: {
      tax: '£12,358,350.00',
      rate: 'Effective tax rate is 19.93%',
      day: '06',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer1000000000: {
      tax: '£199,958,350.00',
      rate: 'Effective tax rate is 20.00%',
      day: '05',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer1234567890: {
      tax: '£246,871,928.00',
      rate: 'Effective tax rate is 20.00%',
      day: '31',
      month: '10',
      year: '2025',
    },
  },

  cy: {
    firstTimeBuyer7750: {
      tax: '£0.00',
      rate: 'Y raddfa dreth effeithiol yw 0.00%',
      day: '11',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer125000: {
      tax: '£0.00',
      rate: 'Y raddfa dreth effeithiol yw 0.00%',
      day: '31',
      month: '10',
      year: '2025',
    },
    nextHomeBuyer38449: {
      tax: '£0.00',
      rate: 'Y raddfa dreth effeithiol yw 0.00%',
      day: '06',
      month: '12',
      year: '2025',
    },
    secondHomeBuyer39000: {
      tax: '£0.00',
      rate: 'Y raddfa dreth effeithiol yw 0.00%',
      day: '05',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer125000: {
      tax: '£7,500.00',
      rate: 'Y raddfa dreth effeithiol yw 6.00%',
      day: '06',
      month: '04',
      year: '2023',
    },
    secondHomeBuyer275000: {
      tax: '£25,350.00',
      rate: 'Y raddfa dreth effeithiol yw 9.22%',
      day: '06',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer310000: {
      tax: '£23,700.00',
      rate: 'Y raddfa dreth effeithiol yw 7.65%',
      day: '04',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer490000: {
      tax: '£61,550.00',
      rate: 'Y raddfa dreth effeithiol yw 12.56%',
      day: '31',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer1234567890: {
      tax: '£222,180,570.00',
      rate: 'Y raddfa dreth effeithiol yw 18.00%',
      day: '04',
      month: '12',
      year: '2024',
    },
  },
};

export default taxValueLBTT;
export type { ScenarioKey };
