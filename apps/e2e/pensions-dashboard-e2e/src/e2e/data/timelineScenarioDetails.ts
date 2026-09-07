export const retirementDateMapTS = {
  'ASH Staff Pension Scheme': '1 January 2033',
  'Neighbourhood Watch Pension Scheme': '9 September 2033',
  'TNN Telecomms': '9 September 2038',
  'Kite Staff Pension Scheme': '9 September 2039',
  'State Pension': '9 September 2040',
} as Record<string, string>;

export const expectedTimelineDataTS = [
  {
    year: '2033',
    monthlyAmount: '£2,750',
    annualAmount: '£33,000',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
    ],
  },
  {
    year: '2038',
    monthlyAmount: '£3,250',
    annualAmount: '£39,000',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'TNN Telecomms',
        estimatedIncome: '£500 a month',
      },
    ],
  },
  {
    year: '2039',
    monthlyAmount: '£3,434',
    annualAmount: '£41,208',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'TNN Telecomms',
        estimatedIncome: '£500 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
    ],
  },
  {
    year: '2040',
    monthlyAmount: '£4,338',
    annualAmount: '£52,056',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'TNN Telecomms',
        estimatedIncome: '£500 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
  {
    year: '2059',
    monthlyAmount: '£3,838',
    annualAmount: '£46,056',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
  {
    year: '2060',
    monthlyAmount: '£2,088',
    annualAmount: '£25,056',
    schemes: [
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
  {
    year: '2062',
    monthlyAmount: '£1,088',
    annualAmount: '£13,056',
    schemes: [
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
];

export const expectedTimelineDataAP = [
  {
    year: '2044',
    monthlyAmount: '£8,916.67',
    annualAmount: '£107,000',
    schemes: [
      {
        name: 'Available ERI and AP',
        estimatedIncome: '£2,500 a month',
      },
      {
        name: 'DC Pension All Available',
        estimatedIncome: '£2,500 a month',
      },
      {
        name: 'ERI with DB Unavailable Code',
        estimatedIncome: '£1,250 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£2,666.67 a month',
      },
    ],
  },
  {
    year: '2065',
    monthlyAmount: '£0',
    annualAmount: '£0',
    schemes: [],
  },
];

export const expectedTimelineDataCDC = [
  {
    year: '2053',
    monthlyAmount: '£933.33',
    annualAmount: '£11,200',
    lumpSumAmount: '£30,000',
    schemes: [
      {
        name: 'Royal Mail  CDC AVC',
        estimatedIncome: '£83.33 a month',
      },
      {
        name: 'Royal Mail Collective Defined Contribution',
        estimatedIncome: '£850 a month',
        lumpSum: '£30,000',
      },
    ],
  },
];

export const expectedTimelineDataCB = [
  {
    year: '2040',
    monthlyAmount: '£1,697.01',
    annualAmount: '£20,364.12',
    cashBalanceAmount: '£200,000',
    schemes: [
      {
        name: 'CB Lump Sum Scheme',
        estimatedIncome: '',
        lumpSum: '£200,000',
      },
      {
        name: 'CB Recurring Scheme',
        estimatedIncome: '£695.83 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£1,001.18 a month',
      },
    ],
  },
];

export const expectedTimelineDataCombination = [
  {
    year: '2037',
    monthlyAmount: '£17,459.84',
    annualAmount: '£209,518',
    lumpSumAmount: '£12,000',
    schemes: [
      {
        name: 'Frank_Type(DC)_Illustrations(DB)',
        estimatedIncome: '£1,500 a month',
      },
      {
        name: 'Frank_Type(DC)_Illustrations(DB,CBS)',
        estimatedIncome: '£1,800 a month',
      },
      {
        name: 'Frank_Type(CB)_Illustrations(CDI,DC)',
        estimatedIncome: '£3,579.92 a month',
      },
      {
        name: 'Frank_Type(DB)_Illustrations(DC,CBS,CDI)',
        estimatedIncome: '£5,579.92 a month',
      },
      {
        name: 'Frank_Type(AVC)_Illustrations(DC)',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'Frank_Type(CDC)_Illustrations(DC,CBL)',
        estimatedIncome: '£1,000 a month',
        lumpSum: '£12,000',
      },
      {
        name: 'Frank_Type(DB)_Illustrations(None)',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'Frank_Type(DB)_Illustrations(DBL,CBS)',
        estimatedIncome: '£2,000 a month',
      },
    ],
  },
];
