interface TaxData {
  tax: string;
  rate: string;
}

interface LocaleData {
  [key: string]: {
    firstTimeBuyer39000: TaxData;
    firstTimeBuyer125000: TaxData;
    firstTimeBuyer300019: TaxData;
    firstTimeBuyer310000: TaxData;
    firstTimeBuyer400012: TaxData;
    firstTimeBuyer510000: TaxData;
    firstTimeBuyer988882: TaxData;
    firstTimeBuyer2100000: TaxData;
    nextHomeBuyer39000: TaxData;
    nextHomeBuyer125000: TaxData;
    nextHomeBuyer185000: TaxData;
    nextHomeBuyer300019: TaxData;
    nextHomeBuyer400012: TaxData;
    nextHomeBuyer510000: TaxData;
    nextHomeBuyer988882: TaxData;
    nextHomeBuyer2100000: TaxData;
    secondHomeBuyer39000: TaxData;
    secondHomeBuyer40000: TaxData;
    secondHomeBuyer125000: TaxData;
    secondHomeBuyer185000: TaxData;
    secondHomeBuyer300019: TaxData;
    secondHomeBuyer400012: TaxData;
    secondHomeBuyer510000: TaxData;
    secondHomeBuyer988882: TaxData;
    secondHomeBuyer2100000: TaxData;
  };
}

const taxValueSDLT: LocaleData = {
  en: {
    firstTimeBuyer39000: {
      tax: '£0',
      rate: 'The effective tax rate is 0.00%',
    },
    firstTimeBuyer125000: {
      tax: '£0',
      rate: 'The effective tax rate is 0.00%',
    },
    firstTimeBuyer300019: {
      tax: '£0',
      rate: 'The effective tax rate is 0.00%',
    },
    firstTimeBuyer310000: {
      tax: '£500',
      rate: 'The effective tax rate is 0.16%',
    },
    firstTimeBuyer400012: {
      tax: '£5,000',
      rate: 'The effective tax rate is 1.25%',
    },
    firstTimeBuyer510000: {
      tax: '£15,500',
      rate: 'The effective tax rate is 3.04%',
    },
    firstTimeBuyer988882: {
      tax: '£42,638',
      rate: 'The effective tax rate is 4.31%',
    },
    firstTimeBuyer2100000: {
      tax: '£165,750',
      rate: 'The effective tax rate is 7.89%',
    },
    nextHomeBuyer39000: {
      tax: '£0',
      rate: 'The effective tax rate is 0.00%',
    },
    nextHomeBuyer125000: {
      tax: '£0',
      rate: 'The effective tax rate is 0.00%',
    },
    nextHomeBuyer185000: {
      tax: '£1,200',
      rate: 'The effective tax rate is 0.65%',
    },
    nextHomeBuyer300019: {
      tax: '£5,000',
      rate: 'The effective tax rate is 1.67%',
    },
    nextHomeBuyer400012: {
      tax: '£10,000',
      rate: 'The effective tax rate is 2.50%',
    },
    nextHomeBuyer510000: {
      tax: '£15,500',
      rate: 'The effective tax rate is 3.04%',
    },
    nextHomeBuyer988882: {
      tax: '£42,638',
      rate: 'The effective tax rate is 4.31%',
    },
    nextHomeBuyer2100000: {
      tax: '£165,750',
      rate: 'The effective tax rate is 7.89%',
    },
    secondHomeBuyer39000: {
      tax: '£0',
      rate: 'The effective tax rate is 0.00%',
    },
    secondHomeBuyer40000: {
      tax: '£2,000',
      rate: 'The effective tax rate is 5.00%',
    },
    secondHomeBuyer125000: {
      tax: '£6,250',
      rate: 'The effective tax rate is 5.00%',
    },
    secondHomeBuyer185000: {
      tax: '£10,450',
      rate: 'The effective tax rate is 5.65%',
    },
    secondHomeBuyer300019: {
      tax: '£20,001',
      rate: 'The effective tax rate is 6.67%',
    },
    secondHomeBuyer400012: {
      tax: '£30,001',
      rate: 'The effective tax rate is 7.50%',
    },
    secondHomeBuyer510000: {
      tax: '£41,000',
      rate: 'The effective tax rate is 8.04%',
    },
    secondHomeBuyer988882: {
      tax: '£92,082',
      rate: 'The effective tax rate is 9.31%',
    },
    secondHomeBuyer2100000: {
      tax: '£270,750',
      rate: 'The effective tax rate is 12.89%',
    },
  },
  cy: {
    firstTimeBuyer39000: {
      tax: '£0',
      rate: 'Y gyfradd dreth effeithiol yw 0.00%',
    },
    firstTimeBuyer125000: {
      tax: '£0',
      rate: 'Y gyfradd dreth effeithiol yw 0.00%',
    },
    firstTimeBuyer300019: {
      tax: '£0',
      rate: 'Y gyfradd dreth effeithiol yw 0.00%',
    },
    firstTimeBuyer310000: {
      tax: '£500',
      rate: 'Y gyfradd dreth effeithiol yw 0.16%',
    },
    firstTimeBuyer400012: {
      tax: '£5,000',
      rate: 'Y gyfradd dreth effeithiol yw 1.25%',
    },
    firstTimeBuyer510000: {
      tax: '£15,500',
      rate: 'Y gyfradd dreth effeithiol yw 3.04%',
    },
    firstTimeBuyer988882: {
      tax: '£42,638',
      rate: 'Y gyfradd dreth effeithiol yw 4.31%',
    },
    firstTimeBuyer2100000: {
      tax: '£165,750',
      rate: 'Y gyfradd dreth effeithiol yw 7.89%',
    },
    nextHomeBuyer39000: {
      tax: '£0',
      rate: 'Y gyfradd dreth effeithiol yw 0.00%',
    },
    nextHomeBuyer125000: {
      tax: '£0',
      rate: 'Y gyfradd dreth effeithiol yw 0.00%',
    },
    nextHomeBuyer185000: {
      tax: '£1,200',
      rate: 'Y gyfradd dreth effeithiol yw 0.65%',
    },
    nextHomeBuyer300019: {
      tax: '£5,000',
      rate: 'Y gyfradd dreth effeithiol yw 1.67%',
    },
    nextHomeBuyer400012: {
      tax: '£10,000',
      rate: 'Y gyfradd dreth effeithiol yw 2.50%',
    },
    nextHomeBuyer510000: {
      tax: '£15,500',
      rate: 'Y gyfradd dreth effeithiol yw 3.04%',
    },
    nextHomeBuyer988882: {
      tax: '£42,638',
      rate: 'Y gyfradd dreth effeithiol yw 4.31%',
    },
    nextHomeBuyer2100000: {
      tax: '£165,750',
      rate: 'Y gyfradd dreth effeithiol yw 7.89%',
    },
    secondHomeBuyer39000: {
      tax: '£0',
      rate: 'Y gyfradd dreth effeithiol yw 0.00%',
    },
    secondHomeBuyer40000: {
      tax: '£2,000',
      rate: 'Y gyfradd dreth effeithiol yw 5.00%',
    },
    secondHomeBuyer125000: {
      tax: '£6,250',
      rate: 'Y gyfradd dreth effeithiol yw 5.00%',
    },
    secondHomeBuyer185000: {
      tax: '£10,450',
      rate: 'Y gyfradd dreth effeithiol yw 5.65%',
    },
    secondHomeBuyer300019: {
      tax: '£20,001',
      rate: 'Y gyfradd dreth effeithiol yw 6.67%',
    },
    secondHomeBuyer400012: {
      tax: '£30,001',
      rate: 'Y gyfradd dreth effeithiol yw 7.50%',
    },
    secondHomeBuyer510000: {
      tax: '£41,000',
      rate: 'Y gyfradd dreth effeithiol yw 8.04%',
    },
    secondHomeBuyer988882: {
      tax: '£92,082',
      rate: 'Y gyfradd dreth effeithiol yw 9.31%',
    },
    secondHomeBuyer2100000: {
      tax: '£270,750',
      rate: 'Y gyfradd dreth effeithiol yw 12.89%',
    },
  },
};

export default taxValueSDLT;
