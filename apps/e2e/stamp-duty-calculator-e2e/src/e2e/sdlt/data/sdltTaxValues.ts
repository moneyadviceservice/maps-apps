export interface TaxData {
  tax: string;
  rate: string;
  day: string;
  month: string;
  year: string;
}

type ScenarioKey =
  // I. First Time Buyer
  // 01. Dates: 31/10/2024 - 31/03/2025
  | 'firstTimeBuyer39000'
  | 'firstTimeBuyer40000'
  | 'firstTimeBuyer125000'
  | 'firstTimeBuyer185000'
  | 'firstTimeBuyer275000'
  | 'firstTimeBuyer300019'
  // 02. Dates: 01/04/2025 - Till date
  | 'firstTimeBuyer310000'
  | 'firstTimeBuyer400012'
  | 'firstTimeBuyer490000'
  | 'firstTimeBuyer510000'
  | 'firstTimeBuyer937000'
  | 'firstTimeBuyer988882'
  | 'firstTimeBuyer2100000'
  // 03. Dates: 01/04/2023 - 30/10/2024
  | 'firstTimeBuyer1234567890'
  | 'firstTimeBuyer9876543210'

  // II. Next Home Buyer
  // 01. Dates: 31/10/2024 - 31/03/2025
  | 'nextHomeBuyer39000'
  | 'nextHomeBuyer40000'
  | 'nextHomeBuyer125000'
  | 'nextHomeBuyer185000'
  | 'nextHomeBuyer275000'
  | 'nextHomeBuyer300019'
  | 'nextHomeBuyer310000'
  // 02. Dates: 01/04/2025 - Till date
  | 'nextHomeBuyer400012'
  | 'nextHomeBuyer490000'
  | 'nextHomeBuyer510000'
  | 'nextHomeBuyer937000'
  | 'nextHomeBuyer988882'
  | 'nextHomeBuyer2100000'
  // 03. Dates: 01/04/2023 - 30/10/2024
  | 'nextHomeBuyer98765432'
  | 'nextHomeBuyer123456789'

  // III. Second Home Buyer
  // 01. Dates: 06/04/2023 - 30/10/2024
  | 'secondHomeBuyer123456789'
  | 'secondHomeBuyer987654321'
  | 'secondHomeBuyer123409876'
  | 'secondHomeBuyer185000'
  | 'secondHomeBuyer300019'
  | 'secondHomeBuyer412000'
  // 02. Dates: 31/10/2024 - 31/03/2025
  | 'secondHomeBuyer39000'
  | 'secondHomeBuyer400000'
  | 'secondHomeBuyer490000'
  | 'secondHomeBuyer275000'
  | 'secondHomeBuyer310000'
  // 03. Dates: 01/04/2025 - Till date
  | 'secondHomeBuyer937000'
  | 'secondHomeBuyer2100000'
  | 'secondHomeBuyer62000000';

interface LocaleData {
  [locale: string]: Record<ScenarioKey, TaxData>;
}

const taxValueSDLT: LocaleData = {
  en: {
    firstTimeBuyer39000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '31',
      month: '10',
      year: '2024',
    },
    firstTimeBuyer40000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '31',
      month: '03',
      year: '2025',
    },
    firstTimeBuyer125000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '30',
      month: '03',
      year: '2025',
    },
    firstTimeBuyer185000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '06',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer275000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '01',
      month: '11',
      year: '2024',
    },
    firstTimeBuyer300019: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '31',
      month: '10',
      year: '2025',
    },
    firstTimeBuyer310000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '11',
      month: '12',
      year: '2024',
    },
    firstTimeBuyer400012: {
      tax: '£5,000',
      rate: 'Effective tax rate is 1.25%',
      day: '02',
      month: '04',
      year: '2025',
    },
    firstTimeBuyer490000: {
      tax: '£9,500',
      rate: 'Effective tax rate is 1.94%',
      day: '04',
      month: '11',
      year: '2025',
    },
    firstTimeBuyer510000: {
      tax: '£15,500',
      rate: 'Effective tax rate is 3.04%',
      day: '01',
      month: '10',
      year: '2025',
    },
    nextHomeBuyer39000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '31',
      month: '10',
      year: '2024',
    },
    nextHomeBuyer40000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '31',
      month: '03',
      year: '2025',
    },
    nextHomeBuyer125000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '01',
      month: '11',
      year: '2024',
    },
    nextHomeBuyer185000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '30',
      month: '03',
      year: '2025',
    },
    nextHomeBuyer275000: {
      tax: '£1,250',
      rate: 'Effective tax rate is 0.45%',
      day: '01',
      month: '01',
      year: '2025',
    },
    nextHomeBuyer300019: {
      tax: '£2,500',
      rate: 'Effective tax rate is 0.83%',
      day: '30',
      month: '10',
      year: '2024',
    },
    nextHomeBuyer310000: {
      tax: '£3,000',
      rate: 'Effective tax rate is 0.97%',
      day: '31',
      month: '12',
      year: '2024',
    },
    nextHomeBuyer400012: {
      tax: '£10,000',
      rate: 'Effective tax rate is 2.50%',
      day: '01',
      month: '04',
      year: '2025',
    },
    nextHomeBuyer490000: {
      tax: '£14,500',
      rate: 'Effective tax rate is 2.96%',
      day: '04',
      month: '11',
      year: '2025',
    },
    secondHomeBuyer123456789: {
      tax: '£18,429,768',
      rate: 'Effective tax rate is 14.93%',
      day: '06',
      month: '04',
      year: '2023',
    },
    secondHomeBuyer987654321: {
      tax: '£148,059,398',
      rate: 'Effective tax rate is 14.99%',
      day: '30',
      month: '10',
      year: '2024',
    },
    secondHomeBuyer123409876: {
      tax: '£18,422,731',
      rate: 'Effective tax rate is 14.93%',
      day: '07',
      month: '04',
      year: '2023',
    },
    secondHomeBuyer185000: {
      tax: '£5,550',
      rate: 'Effective tax rate is 3.00%',
      day: '29',
      month: '10',
      year: '2024',
    },
    secondHomeBuyer300019: {
      tax: '£11,501',
      rate: 'Effective tax rate is 3.83%',
      day: '01',
      month: '01',
      year: '2024',
    },
    secondHomeBuyer412000: {
      tax: '£20,460',
      rate: 'Effective tax rate is 4.97%',
      day: '31',
      month: '12',
      year: '2023',
    },
    secondHomeBuyer39000: {
      tax: '£0',
      rate: 'Effective tax rate is 0.00%',
      day: '31',
      month: '10',
      year: '2024',
    },
    secondHomeBuyer400000: {
      tax: '£27,500',
      rate: 'Effective tax rate is 6.88%',
      day: '31',
      month: '03',
      year: '2025',
    },
    secondHomeBuyer490000: {
      tax: '£36,500',
      rate: 'Effective tax rate is 7.45%',
      day: '01',
      month: '11',
      year: '2024',
    },
  },

  cy: {
    firstTimeBuyer2100000: {
      tax: '£165,750',
      rate: 'Y raddfa dreth effeithiol yw 7.89%',
      day: '01',
      month: '04',
      year: '2025',
    },
    firstTimeBuyer1234567890: {
      tax: '£148,059,397',
      rate: 'Y raddfa dreth effeithiol yw 11.99%',
      day: '06',
      month: '04',
      year: '2023',
    },
    firstTimeBuyer9876543210: {
      tax: '£1,185,096,435',
      rate: 'Y raddfa dreth effeithiol yw 12.00%',
      day: '30',
      month: '10',
      year: '2024',
    },
    nextHomeBuyer510000: {
      tax: '£15,500',
      rate: 'Y raddfa dreth effeithiol yw 3.04%',
      day: '02',
      month: '04',
      year: '2025',
    },
    nextHomeBuyer937000: {
      tax: '£34,950',
      rate: 'Y raddfa dreth effeithiol yw 3.73%',
      day: '01',
      month: '01',
      year: '2025',
    },
    nextHomeBuyer988882: {
      tax: '£40,138',
      rate: 'Y raddfa dreth effeithiol yw 4.06%',
      day: '31',
      month: '12',
      year: '2024',
    },
    nextHomeBuyer2100000: {
      tax: '£163,250',
      rate: 'Y raddfa dreth effeithiol yw 7.77%',
      day: '06',
      month: '04',
      year: '2023',
    },
    nextHomeBuyer98765432: {
      tax: '£11,763,102',
      rate: 'Y raddfa dreth effeithiol yw 11.91%',
      day: '12',
      month: '12',
      year: '2024',
    },
    nextHomeBuyer123456789: {
      tax: '£14,726,064',
      rate: 'Y raddfa dreth effeithiol yw 11.93%',
      day: '30',
      month: '10',
      year: '2024',
    },
    secondHomeBuyer275000: {
      tax: '£15,000',
      rate: 'Y raddfa dreth effeithiol yw 5.45%',
      day: '30',
      month: '03',
      year: '2025',
    },
    secondHomeBuyer310000: {
      tax: '£18,500',
      rate: 'Y raddfa dreth effeithiol yw 5.97%',
      day: '01',
      month: '01',
      year: '2025',
    },
    secondHomeBuyer937000: {
      tax: '£84,300',
      rate: 'Y raddfa dreth effeithiol yw 9.00%',
      day: '01',
      month: '04',
      year: '2025',
    },
    secondHomeBuyer2100000: {
      tax: '£270,750',
      rate: 'Y raddfa dreth effeithiol yw 12.89%',
      day: '04',
      month: '11',
      year: '2025',
    },
    secondHomeBuyer62000000: {
      tax: '£10,453,750',
      rate: 'Y raddfa dreth effeithiol yw 16.86%',
      day: '02',
      month: '04',
      year: '2025',
    },
  },
};

export default taxValueSDLT;
export type { ScenarioKey };
