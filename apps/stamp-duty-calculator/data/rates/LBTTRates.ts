import { parse } from 'date-fns';

import { BuyerTypeRateConfiguration } from '../../utils/rates/rateUtils';

export type BuyerType = 'firstTimeBuyer' | 'nextHome' | 'additionalHome';

export const BUYER_RATE_CONFIGURATIONS: BuyerTypeRateConfiguration<BuyerType>[] =
  [
    {
      buyerType: 'firstTimeBuyer',
      periods: [
        {
          // Current rates: from 06/04/2023 onwards
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: null,
          bands: [
            { start: 0, end: 17500000, rate: 0 },
            { start: 17500001, end: 25000000, rate: 2 },
            { start: 25000001, end: 32500000, rate: 5 },
            { start: 32500001, end: 75000000, rate: 10 },
            { start: 75000001, end: null, rate: 12 },
          ],
        },
      ],
    },
    {
      buyerType: 'nextHome',
      periods: [
        {
          // Current rates: from 06/04/2023 onwards
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: null,
          bands: [
            { start: 0, end: 14500000, rate: 0 },
            { start: 14500001, end: 25000000, rate: 2 },
            { start: 25000001, end: 32500000, rate: 5 },
            { start: 32500001, end: 75000000, rate: 10 },
            { start: 75000001, end: null, rate: 12 },
          ],
        },
      ],
    },
    {
      buyerType: 'additionalHome',
      periods: [
        {
          // Current rates: from 05/12/2024 onwards
          startDate: parse('05/12/2024', 'dd/MM/yyyy', new Date()),
          endDate: null,
          additionalTax: 8, // 8% ADS (Additional Dwelling Supplement)
          minThreshold: 4000000, // £40,000 minimum for ADS to apply
          bands: [
            { start: 0, end: 14500000, rate: 0 },
            { start: 14500001, end: 25000000, rate: 2 },
            { start: 25000001, end: 32500000, rate: 5 },
            { start: 32500001, end: 75000000, rate: 10 },
            { start: 75000001, end: null, rate: 12 },
          ],
        },
        {
          // Past rates: from 06/04/2023 to 04/12/2024
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: parse('04/12/2024', 'dd/MM/yyyy', new Date()),
          additionalTax: 6, // 6% ADS (Additional Dwelling Supplement)
          minThreshold: 4000000, // £40,000 minimum for ADS to apply
          bands: [
            { start: 0, end: 14500000, rate: 0 },
            { start: 14500001, end: 25000000, rate: 2 },
            { start: 25000001, end: 32500000, rate: 5 },
            { start: 32500001, end: 75000000, rate: 10 },
            { start: 75000001, end: null, rate: 12 },
          ],
        },
      ],
    },
  ];
