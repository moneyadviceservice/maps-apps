interface TaxData {
  tax: string;
  rate: string;
}

interface LocaleData {
  [key: string]: {
    firstTimeBuyer467887: TaxData;
    firstTimeBuyer550000: TaxData;
    firstTimeBuyer750000: TaxData;
    firstTimeBuyer1500000: TaxData;
    firstTimeBuyer3333333: TaxData;
    firstTimeBuyer987654321: TaxData;
    secondHomeBuyer39K: TaxData;
    secondHomeBuyer125K: TaxData;
    secondHomeBuyer300019: TaxData;
    secondHomeBuyer400012: TaxData;
    secondHomeBuyer937000: TaxData;
    secondHomeBuyer988882: TaxData;
    secondHomeBuyer2100000: TaxData;
    secondHomeBuyer9999999: TaxData;
  };
}

const taxValueLTT: LocaleData = {
  en: {
    firstTimeBuyer467887: {
      tax: '£15,591.52',
      rate: 'The effective tax rate is 3.33%',
    },
    firstTimeBuyer550000: {
      tax: '£21,750.00',
      rate: 'The effective tax rate is 3.95%',
    },
    firstTimeBuyer750000: {
      tax: '£36,750.00',
      rate: 'The effective tax rate is 4.90%',
    },
    firstTimeBuyer1500000: {
      tax: '£111,750.00',
      rate: 'The effective tax rate is 7.45%',
    },
    firstTimeBuyer3333333: {
      tax: '£331,749.96',
      rate: 'The effective tax rate is 9.95%',
    },
    firstTimeBuyer987654321: {
      tax: '£118,450,268.52',
      rate: 'The effective tax rate is 11.99%',
    },
    secondHomeBuyer39K: { tax: '£0', rate: 'The effective tax rate is 0.00%' },
    secondHomeBuyer125K: {
      tax: '£6,250.00',
      rate: 'The effective tax rate is 5.00%',
    },
    secondHomeBuyer300019: {
      tax: '£19,951.90',
      rate: 'The effective tax rate is 6.65%',
    },
    secondHomeBuyer400012: {
      tax: '£29,951.50',
      rate: 'The effective tax rate is 7.49%',
    },
    secondHomeBuyer937000: {
      tax: '£101,750.00',
      rate: 'The effective tax rate is 10.86%',
    },
    secondHomeBuyer988882: {
      tax: '£109,532.30',
      rate: 'The effective tax rate is 11.08%',
    },
    secondHomeBuyer2100000: {
      tax: '£288,199.99',
      rate: 'The effective tax rate is 13.72%',
    },
    secondHomeBuyer9999999: {
      tax: '£1,631,199.82',
      rate: 'The effective tax rate is 16.31%',
    },
  },
  cy: {
    firstTimeBuyer467887: {
      tax: '£15,591.52',
      rate: 'Y gyfradd dreth effeithiol yw 3.33%',
    },
    firstTimeBuyer550000: {
      tax: '£21,750.00',
      rate: 'Y gyfradd dreth effeithiol yw 3.95%',
    },
    firstTimeBuyer750000: {
      tax: '£36,750.00',
      rate: 'Y gyfradd dreth effeithiol yw 4.90%',
    },
    firstTimeBuyer1500000: {
      tax: '£111,750.00',
      rate: 'Y gyfradd dreth effeithiol yw 7.45%',
    },
    firstTimeBuyer3333333: {
      tax: '£331,749.96',
      rate: 'Y gyfradd dreth effeithiol yw 9.95%',
    },
    firstTimeBuyer987654321: {
      tax: '£118,450,268.52',
      rate: 'Y gyfradd dreth effeithiol yw 11.99%',
    },
    secondHomeBuyer39K: {
      tax: '£0',
      rate: 'Y gyfradd dreth effeithiol yw 0.00%',
    },
    secondHomeBuyer125K: {
      tax: '£6,250.00',
      rate: 'Y gyfradd dreth effeithiol yw 5.00%',
    },
    secondHomeBuyer300019: {
      tax: '£19,951.90',
      rate: 'Y gyfradd dreth effeithiol yw 6.65%',
    },
    secondHomeBuyer400012: {
      tax: '£29,951.50',
      rate: 'Y gyfradd dreth effeithiol yw 7.49%',
    },
    secondHomeBuyer937000: {
      tax: '£101,750.00',
      rate: 'Y gyfradd dreth effeithiol yw 10.86%',
    },
    secondHomeBuyer988882: {
      tax: '£109,532.30',
      rate: 'Y gyfradd dreth effeithiol yw 11.08%',
    },
    secondHomeBuyer2100000: {
      tax: '£288,199.99',
      rate: 'Y gyfradd dreth effeithiol yw 13.72%',
    },
    secondHomeBuyer9999999: {
      tax: '£1,631,199.82',
      rate: 'Y gyfradd dreth effeithiol yw 16.31%',
    },
  },
};

export default taxValueLTT;
