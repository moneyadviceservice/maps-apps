import { parse } from 'date-fns';

import { BuyerTypeRateConfiguration } from '../../utils/rates/rateUtils';

export type BuyerType = 'firstOrNextHome' | 'additionalHome';

// Rate configurations organised by buyer type
// Each buyer type can have different date ranges and rates
export const BUYER_RATE_CONFIGURATIONS: BuyerTypeRateConfiguration<BuyerType>[] =
  [
    {
      buyerType: 'firstOrNextHome',
      periods: [
        {
          // Current rates: from 06/04/2023 onwards (Land Transaction Tax came into effect)
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: null,
          bands: [
            { start: 0, end: 22500000, rate: 0 },
            { start: 22500001, end: 40000000, rate: 6 },
            { start: 40000001, end: 75000000, rate: 7.5 },
            { start: 75000001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
      ],
    },
    {
      buyerType: 'additionalHome',
      periods: [
        {
          // Current higher rates: from 11/12/2024 onwards
          startDate: parse('11/12/2024', 'dd/MM/yyyy', new Date()),
          endDate: null,
          threshold: 4000000, // Threshold for additional home buyers
          bands: [
            { start: 0, end: 18000000, rate: 5 },
            { start: 18000001, end: 25000000, rate: 8.5 },
            { start: 25000001, end: 40000000, rate: 10 },
            { start: 40000001, end: 75000000, rate: 12.5 },
            { start: 75000001, end: 150000000, rate: 15 },
            { start: 150000001, end: null, rate: 17 },
          ],
        },
        {
          // Past rates: from 01/04/2023 to 10/12/2024
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: parse('10/12/2024', 'dd/MM/yyyy', new Date()),
          threshold: 4000000, // Additional homes threshold
          bands: [
            { start: 0, end: 18000000, rate: 4 },
            { start: 18000001, end: 25000000, rate: 7.5 },
            { start: 25000001, end: 40000000, rate: 9 },
            { start: 40000001, end: 75000000, rate: 11.5 },
            { start: 75000001, end: 150000000, rate: 14 },
            { start: 150000001, end: null, rate: 16 },
          ],
        },
      ],
    },
  ];
