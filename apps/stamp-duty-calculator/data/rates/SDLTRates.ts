import { parse } from 'date-fns';

import { BuyerTypeRateConfiguration } from '../../utils/rates/rateUtils';

export type BuyerType = 'firstTimeBuyer' | 'nextHome' | 'additionalHome';

export const BUYER_RATE_CONFIGURATIONS: BuyerTypeRateConfiguration<BuyerType>[] =
  [
    {
      buyerType: 'firstTimeBuyer',
      periods: [
        {
          // Future rates: from 01/04/2025 onwards
          startDate: parse('01/04/2025', 'dd/MM/yyyy', new Date()),
          endDate: null,
          threshold: 50000000, // £500,000 - above this, use standard bands
          bands: [
            { start: 0, end: 30000000, rate: 0 },
            { start: 30000001, end: 92500000, rate: 5 },
            { start: 92500001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
        {
          // Past rates: from 06/04/2023 to 31/03/2025
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: parse('31/03/2025', 'dd/MM/yyyy', new Date()),
          threshold: 62500000, // £625,000 - above this, use standard bands
          bands: [
            { start: 0, end: 42500000, rate: 0 },
            { start: 42500001, end: 92500000, rate: 5 },
            { start: 92500001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
      ],
    },
    {
      buyerType: 'nextHome',
      periods: [
        {
          // Future rates: from 01/04/2025 onwards
          startDate: parse('01/04/2025', 'dd/MM/yyyy', new Date()),
          endDate: null,
          bands: [
            { start: 0, end: 12500000, rate: 0 },
            { start: 12500001, end: 25000000, rate: 2 },
            { start: 25000001, end: 92500000, rate: 5 },
            { start: 92500001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
        {
          // Past rates: from 06/04/2023 to 31/03/2025
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: parse('31/03/2025', 'dd/MM/yyyy', new Date()),
          bands: [
            { start: 0, end: 25000000, rate: 0 },
            { start: 25000001, end: 92500000, rate: 5 },
            { start: 92500001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
      ],
    },
    {
      buyerType: 'additionalHome',
      periods: [
        {
          // Future rates: from 01/04/2025 onwards
          startDate: parse('01/04/2025', 'dd/MM/yyyy', new Date()),
          endDate: null,
          additionalTax: 5, // 5% surcharge on all bands
          minThreshold: 4000000, // £40,000 minimum for surcharge to apply
          bands: [
            { start: 0, end: 12500000, rate: 0 },
            { start: 12500001, end: 25000000, rate: 2 },
            { start: 25000001, end: 92500000, rate: 5 },
            { start: 92500001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
        {
          // Past rates: from 31/10/2024 to 31/03/2025
          startDate: parse('31/10/2024', 'dd/MM/yyyy', new Date()),
          endDate: parse('31/03/2025', 'dd/MM/yyyy', new Date()),
          additionalTax: 5, // 5% surcharge on all bands
          minThreshold: 4000000, // £40,000 minimum for surcharge to apply
          bands: [
            { start: 0, end: 25000000, rate: 0 },
            { start: 25000001, end: 92500000, rate: 5 },
            { start: 92500001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
        {
          // Past rates: from 06/04/2023 to 30/03/2025
          startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
          endDate: parse('30/03/2025', 'dd/MM/yyyy', new Date()),
          additionalTax: 3, // 3% surcharge on all bands
          minThreshold: 4000000, // £40,000 minimum for surcharge to apply
          bands: [
            { start: 0, end: 25000000, rate: 0 },
            { start: 25000001, end: 92500000, rate: 5 },
            { start: 92500001, end: 150000000, rate: 10 },
            { start: 150000001, end: null, rate: 12 },
          ],
        },
      ],
    },
  ];
