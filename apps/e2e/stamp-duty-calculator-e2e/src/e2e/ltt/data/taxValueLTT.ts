export interface TaxData {
  tax: string;
  rate: string;
  day: string;
  month: string;
  year: string;
}

export type BuyerScenario = Record<string, TaxData>;

export type LocaleData = Record<string, BuyerScenario>;

const taxValueLTT: LocaleData = {
  en: {
    firstTimeBuyer39000: {
      tax: '£0.00',
      rate: 'Effective tax rate is 0.00%',
      day: '11',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer185000: {
      tax: '£0.00',
      rate: 'Effective tax rate is 0.00%',
      day: '12',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer300019: {
      tax: '£4,501.14',
      rate: 'Effective tax rate is 1.50%',
      day: '01',
      month: '01',
      year: '2025',
    },
    firstTimeBuyer400012: {
      tax: '£10,500.90	',
      rate: 'Effective tax rate is 2.63%',
      day: '11',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer467887: {
      tax: '£15,591.52',
      rate: 'Effective tax rate is 3.33%',
      day: '15',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer550000: {
      tax: '£21,750.00',
      rate: 'Effective tax rate is 3.95%',
      day: '29',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer750000: {
      tax: '£36,750.00',
      rate: 'Effective tax rate is 4.90%',
      day: '29',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer1500000: {
      tax: '£111,750.00',
      rate: 'Effective tax rate is 7.45%',
      day: '29',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer3333333: {
      tax: '£331,749.96',
      rate: 'Effective tax rate is 9.95%',
      day: '29',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer987654321: {
      tax: '£118,450,268.52',
      rate: 'Effective tax rate is 11.99%',
      day: '01',
      month: '10',
      year: '2023',
    },
    firstTimeBuyer988882: {
      tax: '£60,638.20',
      rate: 'Effective tax rate is 6.13%',
      day: '06',
      month: '04',
      year: '2023',
    },
    firstTimeBuyer2100000: {
      tax: '£183,750.00',
      rate: 'Effective tax rate is 8.75%',
      day: '10',
      month: '12',
      year: '2024',
    },
    //----------------------------------------------------------------------------------------------------
    secondHomeBuyer39000: {
      tax: '£0.00',
      rate: 'Effective tax rate is 0.00%',
      day: '11',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer40000: {
      tax: '£2,000.00',
      rate: 'Effective tax rate is 5.00%',
      day: '01',
      month: '02',
      year: '2025',
    },
    secondHomeBuyer275000: {
      tax: '£14,700.00',
      rate: 'Effective tax rate is 5.35%',
      day: '06',
      month: '04',
      year: '2023',
    },
    secondHomeBuyer490000: {
      tax: '£36,300.00',
      rate: 'Effective tax rate is 7.41%',
      day: '01',
      month: '02',
      year: '2024',
    },
    secondHomeBuyer300019: {
      tax: '£19,951.90',
      rate: 'Effective tax rate is 6.65%',
      day: '29',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer400012: {
      tax: '£29,951.50',
      rate: 'Effective tax rate is 7.49%',
      day: '29',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer937000: {
      tax: '£101,750.00',
      rate: 'Effective tax rate is 10.86%',
      day: '29',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer988882: {
      tax: '£109,532.30',
      rate: 'Effective tax rate is 11.08%',
      day: '29',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer2100000: {
      tax: '£288,199.99',
      rate: 'Effective tax rate is 13.72%',
      day: '29',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer9999999: {
      tax: '£1,631,199.82',
      rate: 'Effective tax rate is 16.31%',
      day: '29',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer125000: {
      tax: '£5,000.00',
      rate: 'Effective tax rate is 4.00%',
      day: '10',
      month: '12',
      year: '2024',
    },
  },
  //----------------------------------------------------------------------------------------------------
  cy: {
    firstTimeBuyer467887: {
      tax: '£15,591.52',
      rate: 'Y raddfa dreth effeithiol yw 3.33%',
      day: '11',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer550000: {
      tax: '£21,750.00',
      rate: 'Y raddfa dreth effeithiol yw 3.95%',
      day: '29',
      month: '10',
      year: '2025',
    },

    firstTimeBuyer750000: {
      tax: '£36,750.00',
      rate: 'Y raddfa dreth effeithiol yw 4.90%',
      day: '01',
      month: '02',
      year: '2025',
    },
    firstTimeBuyer1500000: {
      tax: '£111,750.00',
      rate: 'Y raddfa dreth effeithiol yw 7.45%',
      day: '06',
      month: '04',
      year: '2023',
    },
    firstTimeBuyer3333333: {
      tax: '£331,749.96',
      rate: 'Y raddfa dreth effeithiol yw 9.95%',
      day: '10',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer987654321: {
      tax: '£118,450,268.52',
      rate: 'Y raddfa dreth effeithiol yw 11.99%',
      day: '31',
      month: '10',
      year: '2025',
    },
    //----------------------------------------------------------------------------------------------------
    secondHomeBuyer39000: {
      tax: '£0.00',
      rate: 'Y raddfa dreth effeithiol yw 0.00%',
      day: '29',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer125000: {
      tax: '£6,250.00',
      rate: 'Y raddfa dreth effeithiol yw 5.00%',
      day: '11',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer300019: {
      tax: '£16,951.71',
      rate: 'Y raddfa dreth effeithiol yw 5.65%',
      day: '06',
      month: '04',
      year: '2023',
    },
    secondHomeBuyer400012: {
      tax: '£25,951.38',
      rate: 'Y raddfa dreth effeithiol yw 6.49%',
      day: '11',
      month: '12',
      year: '2023',
    },
    secondHomeBuyer937000: {
      tax: '£101,750.00',
      rate: 'Y raddfa dreth effeithiol yw 10.86%',
      day: '12',
      month: '12',
      year: '2024',
    },
    secondHomeBuyer988882: {
      tax: '£109,532.30',
      rate: 'Y raddfa dreth effeithiol yw 11.08%',
      day: '31',
      month: '10',
      year: '2025',
    },
    secondHomeBuyer2100000: {
      tax: '£267,199.99',
      rate: 'Y raddfa dreth effeithiol yw 12.72%',
      day: '01',
      month: '05',
      year: '2023',
    },
    secondHomeBuyer9999999: {
      tax: '£1,531,199.83',
      rate: 'Y raddfa dreth effeithiol yw 15.31%',
      day: '12',
      month: '12',
      year: '2023',
    },
  },
};

export default taxValueLTT;
