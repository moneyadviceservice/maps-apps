export const mockPensionsData = {
  pensionPolicies: [
    {
      pensionArrangements: [
        {
          externalPensionPolicyId: 'D2007659822',
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ad',
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contactReference: 'Ref/rb-dr-bd-sb-08',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2011-05-16',
          retirementDate: '2025-08-23',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension Admin Highland',
            contactMethods: [
              {
                preferred: true,
                contactMethodDetails: {
                  url: 'https://www.highlandadmin.co.uk',
                },
              },
              {
                preferred: true,
                contactMethodDetails: {
                  email: 'mastertrust@highlandadmin.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800873434',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension Admin Highland',
                  line1: '1 Travis Avenue',
                  line2: 'Main Street',
                  line3: 'Liverpool',
                  postcode: 'M16 0QG',
                  countryCode: 'GB',
                },
              },
            ],
          },
          employmentMembershipPeriods: [
            {
              employerName: 'Borough Finance Centre',
              membershipStartDate: '2011-05-16',
            },
          ],
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'DCC',
                  benefitType: 'DC',
                  calculationMethod: 'SMPI',
                  survivorBenefit: true,
                  dcPot: 540500,
                  safeguardedBenefit: true,
                },
                {
                  illustrationType: 'AP',
                  unavailableReason: 'DCC',
                  benefitType: 'DC',
                  amountType: 'INC',
                  calculationMethod: 'SMPI',
                  dcPot: 540500,
                  survivorBenefit: true,
                  safeguardedBenefit: true,
                },
              ],
              illustrationDate: '2024-01-01',
            },
          ],
        },
        {
          externalPensionPolicyId: 'D9267759822',
          externalAssetId: 'e4f88759-5c0b-4148-82aa-9c6611914e9c',
          matchType: 'DEFN',
          schemeName: 'Workers Trust Local 701',
          contactReference: 'Ref/rb-dr-bd-sb-08',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2002-07-03',
          retirementDate: '2025-08-23',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension For Everyone',
            contactMethods: [
              {
                preferred: false,
                contactMethodDetails: {
                  url: 'https://www.everypension.co.uk',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  email: 'query@everypension.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800093434',
                  usage: ['S'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension For Everyone',
                  line1: '12 Mike Close',
                  line2: 'Main Street',
                  line3: 'Newcastle',
                  postcode: 'S16 3BG',
                  countryCode: '',
                },
              },
            ],
          },
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'DCHA',
                  benefitType: 'DC',
                  calculationMethod: 'SMPI',
                  survivorBenefit: false,
                  dcPot: 311011,
                  safeguardedBenefit: false,
                },
                {
                  illustrationType: 'AP',
                  unavailableReason: 'DCHA',
                  benefitType: 'DC',
                  amountType: 'INC',
                  calculationMethod: 'SMPI',
                  dcPot: 311011,
                  survivorBenefit: false,
                  safeguardedBenefit: false,
                },
              ],
              illustrationDate: '2024-01-09',
            },
          ],
        },
        {
          matchType: 'DEFN',
          schemeName: 'State Pension',
          pensionType: 'SP',
          retirementDate: '2042-02-23',
          externalAssetId: '7f0763a9-ac18-43c3-b2e7-723a74eba292',
          benefitIllustrations: [
            {
              illustrationDate: '2024-08-24',
              illustrationComponents: [
                {
                  benefitType: 'SP',
                  payableDetails: {
                    amountType: 'INC',
                    payableDate: '2042-02-23',
                    annualAmount: 11502,
                    monthlyAmount: 958.5,
                    increasing: true,
                  },
                  illustrationType: 'ERI',
                  calculationMethod: 'BS',
                },
              ],
            },
            {
              illustrationDate: '2024-08-24',
              illustrationComponents: [
                {
                  benefitType: 'SP',
                  payableDetails: {
                    amountType: 'INC',
                    payableDate: '2042-02-23',
                    annualAmount: 11502,
                    monthlyAmount: 958.5,
                    increasing: true,
                  },
                  illustrationType: 'AP',
                  calculationMethod: 'BS',
                },
              ],
            },
          ],
          pensionAdministrator: {
            name: 'DWP',
            contactMethods: [
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Freepost DWP',
                  line1: 'Pensions Service 3',
                  countryCode: 'GB',
                },
              },
              {
                preferred: true,
                contactMethodDetails: {
                  url: 'https://www.gov.uk/future-pension-centre',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 8007310175',
                  usage: ['M', 'W'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 8007310176',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 8007310456',
                  usage: ['W'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 1912182051',
                  usage: ['N'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 1912183600',
                  usage: ['N'],
                },
              },
            ],
          },
          additionalDataSources: [
            {
              url: 'https://www.gov.uk/check-state-pension',
              informationType: 'SP',
            },
          ],
          statePensionMessageEng: 'State pension message in English.',
          statePensionMessageWelsh: 'Neges pensiwn gwladol yn Saesneg.',
        },
        {
          externalPensionPolicyId: 'D2007659822',
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ad',
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contactReference: 'Ref/rb-dr-bd-sb-08',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2011-05-16',
          retirementDate: '2025-08-23',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension Admin Highland',
            contactMethods: [
              {
                preferred: true,
                contactMethodDetails: {
                  url: 'https://www.highlandadmin.co.uk',
                },
              },
              {
                preferred: true,
                contactMethodDetails: {
                  email: 'mastertrust@highlandadmin.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800873434',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension Admin Highland',
                  line1: '1 Travis Avenue',
                  line2: 'Main Street',
                  line3: 'Liverpool',
                  postcode: 'M16 0QG',
                  countryCode: 'GB',
                },
              },
            ],
          },
          employmentMembershipPeriods: [
            {
              employerName: 'Borough Finance Centre',
              membershipStartDate: '2011-05-16',
            },
          ],
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'MEM',
                  benefitType: 'DC',
                  calculationMethod: 'SMPI',
                  survivorBenefit: true,
                  dcPot: 540500,
                  safeguardedBenefit: true,
                },
              ],
              illustrationDate: '2024-01-01',
            },
          ],
        },
        {
          externalPensionPolicyId: 'D2007659822',
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ad',
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contactReference: 'Ref/rb-dr-bd-sb-08',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2011-05-16',
          retirementDate: '2025-08-23',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension Admin Highland',
            contactMethods: [
              {
                preferred: true,
                contactMethodDetails: {
                  url: 'https://www.highlandadmin.co.uk',
                },
              },
              {
                preferred: true,
                contactMethodDetails: {
                  email: 'mastertrust@highlandadmin.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800873434',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension Admin Highland',
                  line1: '1 Travis Avenue',
                  line2: 'Main Street',
                  line3: 'Liverpool',
                  postcode: 'M16 0QG',
                  countryCode: 'GB',
                },
              },
            ],
          },
          employmentMembershipPeriods: [
            {
              employerName: 'Borough Finance Centre',
              membershipStartDate: '2011-05-16',
            },
          ],
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'PPF',
                  benefitType: 'DC',
                  calculationMethod: 'SMPI',
                  survivorBenefit: true,
                  dcPot: 540500,
                  safeguardedBenefit: true,
                },
              ],
              illustrationDate: '2024-01-01',
            },
          ],
        },
        {
          externalPensionPolicyId: 'D2007659822',
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ad',
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contactReference: 'Ref/rb-dr-bd-sb-08',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2011-05-16',
          retirementDate: '2025-08-23',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension Admin Highland',
            contactMethods: [
              {
                preferred: true,
                contactMethodDetails: {
                  url: 'https://www.highlandadmin.co.uk',
                },
              },
              {
                preferred: true,
                contactMethodDetails: {
                  email: 'mastertrust@highlandadmin.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800873434',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension Admin Highland',
                  line1: '1 Travis Avenue',
                  line2: 'Main Street',
                  line3: 'Liverpool',
                  postcode: 'M16 0QG',
                  countryCode: 'GB',
                },
              },
            ],
          },
          employmentMembershipPeriods: [
            {
              employerName: 'Borough Finance Centre',
              membershipStartDate: '2011-05-16',
            },
          ],
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'WU',
                  benefitType: 'DC',
                  calculationMethod: 'SMPI',
                  survivorBenefit: true,
                  dcPot: 540500,
                  safeguardedBenefit: true,
                },
              ],
              illustrationDate: '2024-01-01',
            },
          ],
        },
        {
          externalPensionPolicyId: 'D9267759822',
          externalAssetId: '22af2958-6389-4457-b9da-dab16c7652a0',
          matchType: 'DEFN',
          schemeName: 'ANO Trust Local',
          contactReference: 'Ref/ANO12345',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2002-07-03',
          retirementDate: '2044-09-18',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension For Everyone',
            contactMethods: [
              {
                preferred: false,
                contactMethodDetails: {
                  url: 'https://www.everypension.co.uk',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  email: 'query@everypension.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800093434',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension For Everyone',
                  line1: '12 Mike Close',
                  line2: 'Main Street',
                  line3: 'Newcastle',
                  postcode: 'S16 3BG',
                  countryCode: 'GB',
                },
              },
            ],
          },
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'ANO',
                  benefitType: 'DC',
                },
              ],
              illustrationDate: '2024-01-09',
            },
          ],
        },
        {
          externalPensionPolicyId: 'aofeihaaishf',
          externalAssetId: '41c9c850-f582-4ec9-be21-c1ed01df5ba2',
          matchType: 'DEFN',
          schemeName: 'NET Trust Local',
          contactReference: 'Ref/NET12345',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2002-07-03',
          retirementDate: '2044-09-18',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension For Everyone',
            contactMethods: [
              {
                preferred: false,
                contactMethodDetails: {
                  url: 'https://www.everypension.co.uk',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  email: 'query@everypension.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800093434',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension For Everyone',
                  line1: '12 Mike Close',
                  line2: 'Main Street',
                  line3: 'Newcastle',
                  postcode: 'S16 3BG',
                  countryCode: 'GB',
                },
              },
            ],
          },
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'NET',
                  benefitType: 'DC',
                },
              ],
              illustrationDate: '2024-01-09',
            },
          ],
        },
        {
          externalPensionPolicyId: 'F6345587234',
          externalAssetId: '119c3cd1-9f62-4ae1-8854-80b07f6d28b3',
          matchType: 'DEFN',
          schemeName: 'TRN Trust Local',
          contactReference: 'Ref/TRN12345',
          pensionType: 'DC',
          pensionOrigin: 'WM',
          pensionStatus: 'I',
          startDate: '2002-07-03',
          retirementDate: '2044-09-18',
          dateOfBirth: '1979-09-18',
          statePensionMessageEng: 'State Pension Message English',
          statePensionMessageWelsh: 'State Pension Message Welsh',
          pensionAdministrator: {
            name: 'Pension For Everyone',
            contactMethods: [
              {
                preferred: false,
                contactMethodDetails: {
                  url: 'https://www.everypension.co.uk',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  email: 'query@everypension.com',
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  number: '+44 800093434',
                  usage: ['M'],
                },
              },
              {
                preferred: false,
                contactMethodDetails: {
                  postalName: 'Pension For Everyone',
                  line1: '12 Mike Close',
                  line2: 'Main Street',
                  line3: 'Newcastle',
                  postcode: 'S16 3BG',
                  countryCode: 'GB',
                },
              },
            ],
          },
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'ERI',
                  unavailableReason: 'TRN',
                  benefitType: 'DC',
                },
              ],
              illustrationDate: '2024-01-09',
            },
          ],
        },
      ],
    },
  ],
  peiInformation: {
    peiRetrievalComplete: false,
    peiData: [
      {
        pei: '4572fe02-ed14-4738-b6c1-7b71cfd09c16:e4f88759-5c0b-4148-82aa-9c6611914e9c',
        description: 'Workers Trust Local 701',
        retrievalStatus: 'RETRIEVAL_COMPLETE',
      },
      {
        pei: '7075aa11-10ad-4b2f-a9f5-1068e79119bf:b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ad',
        description: 'Master Trust Workplace 0887',
        retrievalStatus: 'RETRIEVAL_COMPLETE',
      },
      {
        pei: '7075aa11-10ad-4b2f-a9f5-1068e79119bf:7f0763a9-ac18-43c3-b2e7-723a74eba292',
        description: 'State Pension Details',
        retrievalStatus: 'RETRIEVAL_COMPLETE',
      },
    ],
  },
  pensionsDataRetrievalComplete: true,
};

export const mockPensionDetail = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  mockPensionsData.pensionPolicies[0].pensionArrangements[1],
];

export const mockIncompletePensions = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  mockPensionsData.pensionPolicies[0].pensionArrangements[6],
  mockPensionsData.pensionPolicies[0].pensionArrangements[7],
  mockPensionsData.pensionPolicies[0].pensionArrangements[8],
  mockPensionsData.pensionPolicies[0].pensionArrangements[1],
];

export const mockConfirmedPensions = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[2],
];

export const mockPolicyPension = [
  {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
    benefitIllustrations: undefined,
  },
];

export const mockUnconfirmedPensions = [
  {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
    matchType: 'POSS',
  },
  {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
    matchType: 'CONT',
  },
  mockPensionsData.pensionPolicies[0].pensionArrangements[3],
  mockPensionsData.pensionPolicies[0].pensionArrangements[4],
  mockPensionsData.pensionPolicies[0].pensionArrangements[5],
];
