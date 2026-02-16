import { PensionGroup } from '../constants';
import { ChartIllustration } from '../types';

export const mockPensionsData = {
  pensionPolicies: [
    {
      pensionArrangements: [
        {
          externalPensionPolicyId: 'D2007659822',
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ab',
          group: PensionGroup.YELLOW,
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contributionsFromMultipleEmployers: false,
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
              membershipEndDate: '',
              employerStatus: 'C',
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
          detailData: {
            benefitType: 'DC',
            unavailableCode: 'WU',
            retirementDate: '2025-08-23',
            incomeAndValues: [
              {
                bar: {
                  eri: {
                    monthlyAmount: undefined,
                    annualAmount: undefined,
                    payableDate: undefined,
                    benefitType: 'DC',
                    safeguardedBenefit: true,
                    survivorBenefit: true,
                    calculationMethod: 'SMPI',
                    warnings: [],
                  },
                  ap: {
                    monthlyAmount: undefined,
                    annualAmount: undefined,
                    payableDate: undefined,
                    benefitType: 'DC',
                    safeguardedBenefit: true,
                    survivorBenefit: true,
                    calculationMethod: 'SMPI',
                    warnings: [],
                  },
                  illustrationDate: '2024-01-01',
                },
                donut: {
                  eri: {
                    amount: 540500,
                    payableDate: undefined,
                    benefitType: 'DC',
                    safeguardedBenefit: true,
                    survivorBenefit: true,
                    calculationMethod: 'SMPI',
                    warnings: [],
                  },
                  ap: {
                    amount: 540500,
                    payableDate: '2024-01-01',
                    benefitType: 'DC',
                    safeguardedBenefit: true,
                    survivorBenefit: true,
                    calculationMethod: 'SMPI',
                    warnings: [],
                  },
                  illustrationDate: '2024-01-01',
                },
              },
            ],
          },
        },
        {
          externalPensionPolicyId: 'D9267759822',
          externalAssetId: 'e4f88759-5c0b-4148-82aa-9c6611914e9c',
          group: PensionGroup.YELLOW,
          matchType: 'DEFN',
          schemeName: 'Workers Trust Local 701',
          contributionsFromMultipleEmployers: false,
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
          group: PensionGroup.GREEN,
          matchType: 'DEFN',
          schemeName: 'State Pension',
          contributionsFromMultipleEmployers: false,
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
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ac',
          group: PensionGroup.RED,
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contributionsFromMultipleEmployers: false,
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
          group: PensionGroup.GREEN,
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contactReference: 'Ref/rb-dr-bd-sb-08',
          contributionsFromMultipleEmployers: false,
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
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ae',
          group: PensionGroup.GREEN,
          matchType: 'DEFN',
          schemeName: 'Master Trust Workplace 0887',
          contributionsFromMultipleEmployers: true,
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
          group: PensionGroup.YELLOW,
          matchType: 'DEFN',
          schemeName: 'ANO Trust Local',
          contributionsFromMultipleEmployers: false,
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
          group: PensionGroup.YELLOW,
          matchType: 'DEFN',
          schemeName: 'NET Trust Local',
          contributionsFromMultipleEmployers: false,
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
          group: PensionGroup.YELLOW,
          matchType: 'DEFN',
          schemeName: 'TRN Trust Local',
          contributionsFromMultipleEmployers: false,
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
        {
          externalPensionPolicyId: 'MEMaofeihaaishf',
          externalAssetId: '49664c73-80af-48eb-b40a-1519f2b760b5',
          group: PensionGroup.GREEN_NO_INCOME,
          matchType: 'DEFN',
          schemeName: 'TestSML:Visa',
          contributionsFromMultipleEmployers: false,
          contactReference: 'LV6694PL',
          pensionType: 'DC',
          pensionOrigin: 'PT',
          pensionStatus: 'I',
          startDate: '2011-11-22',
          retirementDate: '2051-04-01',
          dateOfBirth: '1991-08-06',
          pensionAdministrator: {
            name: 'Phoenix',
            contactMethods: [
              {
                preferred: true,
                contactMethodDetails: {
                  url: 'https://www.phoenixlife.co.uk/customer-centre/contact-us',
                },
              },
            ],
          },
          employmentMembershipPeriods: [
            {
              employerName: 'VISA',
              employerStatus: 'C',
              membershipStartDate: '2019-09-09',
            },
          ],
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: 'AP',
                  benefitType: 'DC',
                  calculationMethod: 'SMPI',
                  payableDetails: {
                    amountType: 'INC',
                    annualAmount: 2530,
                    monthlyAmount: 210.83,
                    payableDate: '2051-04-01',
                    increasing: false,
                  },
                  dcPot: 56894,
                  survivorBenefit: false,
                  safeguardedBenefit: false,
                },
                {
                  illustrationType: 'ERI',
                  benefitType: '',
                  calculationMethod: '',
                  payableDetails: {
                    reason: 'SML',
                    payableDate: '2051-04-01',
                  },
                  dcPot: 77400,
                  survivorBenefit: false,
                  safeguardedBenefit: false,
                },
              ],
              illustrationDate: '2024-07-25',
            },
          ],
          additionalDataSources: [
            {
              url: 'https://www.phoenixlife.co.uk/costs',
              informationType: 'C_AND_C',
            },
            {
              url: 'https://www.phoenixlife.co.uk/master-report',
              informationType: 'ANR',
            },
          ],
          detailData: {
            benefitType: 'DC',
            unavailableCode: 'DCC',
            retirementDate: '2051-04-01',
          },
        },
        {
          externalPensionPolicyId: 'D2007659822',
          externalAssetId: 'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ab',
          matchType: 'DEFN',
          schemeName: 'AVC Pension',
          contributionsFromMultipleEmployers: false,
          contactReference: 'Ref/rb-dr-bd-sb-08',
          pensionType: 'AVC',
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
              membershipEndDate: '',
              employerStatus: 'C',
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

export const mockIncompletePensions = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  mockPensionsData.pensionPolicies[0].pensionArrangements[6],
  mockPensionsData.pensionPolicies[0].pensionArrangements[7],
  mockPensionsData.pensionPolicies[0].pensionArrangements[8],
];

export const mockConfirmedPensions = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[2],
];

export const mockConfirmedPensionsNoIncome = [];

export const mockUnconfirmedPensions = [
  {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
    matchType: 'POSS',
    group: PensionGroup.RED,
  },
  {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
    matchType: 'CONT',
    group: PensionGroup.RED,
  },
  mockPensionsData.pensionPolicies[0].pensionArrangements[3],
];

export const mockPensionDetails = {
  ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  benefitIllustrations: [
    {
      ...mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .benefitIllustrations[0],
      illustrationComponents: [
        {
          illustrationType: 'ERI',
          unavailableReason: 'DCC',
          benefitType: 'DC',
          calculationMethod: 'SMPI',
          survivorBenefit: true,
          safeguardedBenefit: true,
          illustrationWarnings: ['AVC', 'CUR', 'DEF', 'FAS', 'PEO'],
          payableDetails: {
            amountType: 'INC',
            payableDate: '2042-02-23',
            annualAmount: 11502,
            monthlyAmount: 958.5,
            increasing: true,
            lastPaymentDate: '2054-02-23',
          },
          dcPot: 235000,
        },
        {
          illustrationType: 'AP',
          unavailableReason: 'DCC',
          benefitType: 'DC',
          amountType: 'INC',
          calculationMethod: 'CBI',
          survivorBenefit: false,
          safeguardedBenefit: false,
          illustrationWarnings: ['PNR', 'PSO', 'SPA', 'TVI', 'UNP'],
          payableDetails: {
            amountType: 'INCL',
            payableDate: '2042-02-23',
            annualAmount: 11502,
            monthlyAmount: 958.5,
            increasing: false,
            lastPaymentDate: '',
          },
          dcPot: 235000,
        },
      ],
      illustrationDate: '2024-01-01',
    },
  ],
};

export const mockPensionDetailsNoData = {
  ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  startDate: undefined,
  pensionStatus: undefined,
  benefitIllustrations: undefined,
  employmentMembershipPeriods: undefined,
  retirementDate: undefined,
  pensionOrigin: undefined,
  contactReference: undefined,
};

export const mockPensionDetailsDB = {
  ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  group: PensionGroup.GREEN,
  pensionType: 'DB',
  benefitIllustrations: [
    {
      illustrationComponents: [
        {
          illustrationType: 'ERI',
          benefitType: 'DB',
          calculationMethod: 'SMPI',
          payableDetails: {
            payableDate: '2026-03-16',
            amountType: 'CSH',
            amount: 9999,
          },
          survivorBenefit: false,
          safeguardedBenefit: false,
        },
        {
          illustrationType: 'AP',
          benefitType: 'DB',
          calculationMethod: 'SMPI',
          payableDetails: {
            payableDate: '2026-03-16',
            amountType: 'CSH',
            amount: 9999,
          },
          survivorBenefit: false,
          safeguardedBenefit: false,
        },
      ],
      illustrationDate: '2025-01-01',
    },
  ],
};

export const mockUnsupportedPensions = [
  {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[10],
  },
];

export const mockPensionDetailsSP = {
  ...mockPensionsData.pensionPolicies[0].pensionArrangements[2],
  externalAssetId: 'D2052SS659822',
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
  detailData: {
    monthlyAmount: 958.5,
    retirementDate: '2042-02-23',
    benefitType: 'SP',
    warnings: [],
    incomeAndValues: [
      {
        bar: {
          eri: {
            payableDate: '2042-02-23',
            annualAmount: 11502,
            monthlyAmount: 958.5,
            benefitType: 'SP',
            increasing: true,
            safeguardedBenefit: false,
            survivorBenefit: false,
            calculationMethod: 'SMPI',
            warnings: [],
          },
          ap: {
            annualAmount: 11502,
            monthlyAmount: 958.5,
            payableDate: '2042-02-23',
            benefitType: 'SP',
            safeguardedBenefit: false,
            survivorBenefit: false,
            calculationMethod: 'BS',
            warnings: [],
          },
          illustrationDate: '2024-01-01',
        },
      },
    ],
  },
};

export const mockPensionDetailsDBRecurring = {
  ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  group: PensionGroup.GREEN,
  pensionType: 'DB',
  benefitIllustrations: [
    {
      illustrationDate: '2024-08-24',
      illustrationComponents: [
        {
          benefitType: 'DB',
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
        {
          benefitType: 'DB',
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
    {
      illustrationDate: '2024-01-01',
      illustrationComponents: [
        {
          illustrationType: 'ERI',
          benefitType: 'DB',
          calculationMethod: 'SMPI',
          payableDetails: {
            payableDate: '2026-03-16',
            amountType: 'CSH',
            amount: 19999,
          },
          survivorBenefit: false,
          safeguardedBenefit: true,
        },
        {
          illustrationType: 'AP',
          benefitType: 'DB',
          calculationMethod: 'SMPI',
          payableDetails: {
            payableDate: '2026-03-16',
            amountType: 'CSH',
            amount: 9999,
          },
          survivorBenefit: false,
          safeguardedBenefit: true,
        },
      ],
    },
  ],
  detailData: {
    monthlyAmount: 958.5,
    retirementDate: '2042-02-23',
    lumpSumPayableDate: '2026-03-16',
    lumpSumAmount: 19999,
    benefitType: 'DB',
    warnings: [],
    incomeAndValues: [
      {
        bar: {
          eri: {
            annualAmount: 11502,
            monthlyAmount: 958.5,
            payableDate: '2042-02-23',
            benefitType: 'DB',
            increasing: true,
            safeguardedBenefit: false,
            survivorBenefit: false,
            calculationMethod: 'BS',
            warnings: [],
          },
          ap: {
            annualAmount: 11502,
            monthlyAmount: 958.5,
            benefitType: 'DB',
            increasing: true,
            payableDate: '2024-01-01',
            safeguardedBenefit: false,
            survivorBenefit: false,
            calculationMethod: 'BS',
            warnings: [],
          },
          illustrationDate: '2024-01-01',
        },
        donut: {
          eri: {
            amount: 19999,
            payableDate: '2026-03-16',
            benefitType: 'DB',
            safeguardedBenefit: true,
            survivorBenefit: false,
            calculationMethod: 'SMPI',
            warnings: [],
          },
          ap: {
            amount: 9999,
            payableDate: '2024-01-01',
            benefitType: 'DB',
            safeguardedBenefit: true,
            survivorBenefit: false,
            calculationMethod: 'SMPI',
            warnings: [],
          },
          illustrationDate: '2024-01-01',
        },
      },
    ],
  },
};

export const mockPensionDetailsDCRecurring = {
  ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  externalAssetId: 'D2007633822',
  group: PensionGroup.GREEN,
  pensionType: 'DC',
  benefitIllustrations: [
    {
      illustrationDate: '2024-08-24',
      illustrationComponents: [
        {
          benefitType: 'DC',
          payableDetails: {
            amountType: 'INC',
            payableDate: '2042-02-23',
            annualAmount: 11502,
            monthlyAmount: 958.5,
            increasing: true,
          },
          dcPot: 12500,
          illustrationType: 'ERI',
          calculationMethod: 'BS',
        },
        {
          benefitType: 'DC',
          payableDetails: {
            amountType: 'INC',
            payableDate: '2042-02-23',
            annualAmount: 11502,
            monthlyAmount: 958.5,
            increasing: true,
          },
          dcPot: 4500,
          illustrationType: 'AP',
          calculationMethod: 'BS',
        },
      ],
    },
  ],
  detailData: {
    monthlyAmount: 958.5,
    retirementDate: '2042-02-23',
    potValue: 4500,
    benefitType: 'DC',
  },
};

export const mockAVC = {
  externalPensionPolicyId: 'D2007659822',
  externalAssetId: '344cd30a-cebf-4422-b371-0aefe120c935',
  matchType: 'DEFN',
  schemeName: 'AVC Pension',
  contributionsFromMultipleEmployers: false,
  contactReference: 'WCPHH5501',
  pensionType: 'AVC',
  pensionOrigin: 'WM',
  pensionStatus: 'I',
  startDate: '1990-11-22',
  retirementDate: '2038-12-08',
  dateOfBirth: '1971-12-08',
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
      membershipStartDate: '1990-11-22',
      membershipEndDate: '1998-05-15',
      employerStatus: 'H',
    },
  ],
  benefitIllustrations: [
    {
      illustrationComponents: [
        {
          illustrationType: 'ERI',
          benefitType: 'AVC',
          calculationMethod: 'SMPI',
          survivorBenefit: true,
          safeguardedBenefit: true,
          increasing: true,
          payableDetails: {
            amountType: 'INC',
            annualAmount: 4460,
            payableDate: '2038-12-07',
            monthlyAmount: 371.67,
            increasing: true,
          },
          dcPot: 89000,
        },
        {
          illustrationType: 'AP',
          benefitType: 'AVC',
          amountType: 'INC',
          calculationMethod: 'SMPI',
          survivorBenefit: true,
          safeguardedBenefit: true,
          payableDetails: {
            amountType: 'INC',
            annualAmount: 3240,
            payableDate: '2038-12-07',
            monthlyAmount: 270,
            increasing: true,
          },
          dcPot: 64800,
        },
      ],
      illustrationDate: '2024-10-23',
    },
  ],
  detailData: {
    monthlyAmount: 371.67,
    retirementDate: '2038-12-07',
    potValue: 64800,
    benefitType: 'AVC',
    warnings: [],
    incomeAndValues: [
      {
        bar: {
          eri: {
            monthlyAmount: 371.67,
            annualAmount: 4460,
            payableDate: '2038-12-07',
            benefitType: 'AVC',
            safeguardedBenefit: true,
            survivorBenefit: true,
            calculationMethod: 'SMPI',
            warnings: [],
          },
          ap: {
            monthlyAmount: 270,
            annualAmount: 3240,
            payableDate: '2024-10-23',
            benefitType: 'AVC',
            safeguardedBenefit: true,
            survivorBenefit: true,
            calculationMethod: 'SMPI',
            warnings: [],
          },
          illustrationDate: '2024-10-23',
        },
        donut: {
          eri: {
            amount: 89000,
            payableDate: '2038-12-07',
            benefitType: 'AVC',
            safeguardedBenefit: true,
            survivorBenefit: true,
            calculationMethod: 'SMPI',
            warnings: [],
          },
          ap: {
            amount: 64800,
            payableDate: '2024-10-23',
            benefitType: 'AVC',
            safeguardedBenefit: true,
            survivorBenefit: true,
            calculationMethod: 'SMPI',
            warnings: [],
          },
          illustrationDate: '2024-10-23',
        },
      },
    ],
  },
};

export const mockHybrid = [
  {
    externalPensionPolicyId: 'D2007659822',
    externalAssetId: 'c071c2ae-97e8-46b1-b50b-acd143eafcbb',
    schemeName: 'Reliable Motors Pension Scheme (DC)',
    contributionsFromMultipleEmployers: false,
    matchType: 'DEFN',
    retirementDate: '2032-08-13',
    dateOfBirth: '1965-08-13',
    pensionType: 'HYB',
    pensionOrigin: 'WM',
    pensionStatus: 'A',
    contactReference: 'B56790P',
    startDate: '2008-04-01',
    benefitIllustrations: [
      {
        illustrationDate: '2025-05-05',
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            survivorBenefit: true,
            safeguardedBenefit: true,
            benefitType: 'DC',
            calculationMethod: 'SMPI',
            payableDetails: {
              amountType: 'INC',
              annualAmount: 8350,
              payableDate: '2040-09-09',
              monthlyAmount: 695.83,
            },
            dcPot: 131000,
          },
          {
            illustrationType: 'AP',
            survivorBenefit: true,
            safeguardedBenefit: true,
            benefitType: 'DC',
            calculationMethod: 'SMPI',
            payableDetails: {
              amountType: 'INC',
              annualAmount: 950,
              payableDate: '2040-09-09',
              monthlyAmount: 79.17,
            },
            dcPot: 14800,
          },
        ],
      },
    ],
    pensionAdministrator: {
      name: 'Fixr',
      contactMethods: [
        {
          preferred: true,
          contactMethodDetails: {
            url: 'https://www.fixr.co.uk',
          },
        },
      ],
    },
    employmentMembershipPeriods: [
      {
        employerName: 'Reliable Motors',
        employerStatus: 'C',
        membershipEndDate: '',
        membershipStartDate: '2008-04-01',
      },
    ],
    pensionCategory: 'CONFIRMED',
    hasIncome: true,
    group: 'green',
    detailData: {
      monthlyAmount: 695.83,
      retirementDate: '2040-09-09',
      potValue: 14800,
      benefitType: 'DC',
      warnings: [],
      incomeAndValues: [
        {
          bar: {
            eri: {
              monthlyAmount: 695.83,
              annualAmount: 8350,
              payableDate: '2040-09-09',
              benefitType: 'DC',
              survivorBenefit: true,
              safeguardedBenefit: true,
              calculationMethod: 'SMPI',
              warnings: [],
            },
            ap: {
              monthlyAmount: 79.17,
              annualAmount: 950,
              payableDate: '2025-05-05',
              benefitType: 'DC',
              safeguardedBenefit: true,
              survivorBenefit: true,
              calculationMethod: 'SMPI',
              warnings: [],
            },
            illustrationDate: '2025-05-05',
          },
          donut: {
            eri: {
              amount: 131000,
              payableDate: '2040-09-09',
              benefitType: 'DC',
              safeguardedBenefit: true,
              survivorBenefit: true,
              calculationMethod: 'SMPI',
              warnings: [],
            },
            ap: {
              amount: 14800,
              payableDate: '2025-05-05',
              benefitType: 'DC',
              safeguardedBenefit: true,
              survivorBenefit: true,
              calculationMethod: 'SMPI',
              warnings: [],
            },
            illustrationDate: '2025-05-05',
          },
        },
      ],
    },
  },
  {
    externalPensionPolicyId: 'D2007659822',
    externalAssetId: 'f45feb1d-3928-4097-a882-ec997e8a5bd4',
    schemeName: 'Fry & Tingle Pension Scheme (DB)',
    contributionsFromMultipleEmployers: false,
    matchType: 'DEFN',
    retirementDate: '2032-08-13',
    dateOfBirth: '1965-08-13',
    pensionType: 'HYB',
    pensionOrigin: 'WM',
    pensionStatus: 'A',
    contactReference: 'FT810087',
    startDate: '2008-04-01',
    benefitIllustrations: [
      {
        illustrationDate: '2025-09-05',
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            survivorBenefit: true,
            safeguardedBenefit: true,
            benefitType: 'DB',
            payableDetails: {
              amountType: 'INC',
              annualAmount: 31678,
              payableDate: '2040-10-23',
              increasing: true,
              monthlyAmount: 2639.83,
            },
            illustrationWarnings: ['UNP'],
          },
          {
            illustrationType: 'AP',
            survivorBenefit: false,
            safeguardedBenefit: false,
            benefitType: 'DB',
            calculationMethod: 'BS',
            payableDetails: {
              amountType: 'INC',
              annualAmount: 23997,
              payableDate: '2040-10-23',
              monthlyAmount: 1999.75,
            },
          },
        ],
      },
      {
        illustrationDate: '2025-09-05',
        illustrationComponents: [
          {
            illustrationType: 'ERI',
            survivorBenefit: true,
            safeguardedBenefit: true,
            benefitType: 'DB',
            payableDetails: {
              amountType: 'CSH',
              amount: 126712,
              payableDate: '2040-10-23',
            },
            illustrationWarnings: ['UNP'],
          },
          {
            illustrationType: 'AP',
            survivorBenefit: true,
            safeguardedBenefit: true,
            benefitType: 'DB',
            calculationMethod: 'BS',
            payableDetails: {
              amountType: 'CSH',
              amount: 95988,
              payableDate: '2040-10-23',
            },
            illustrationWarnings: ['UNP'],
          },
        ],
      },
    ],
    pensionAdministrator: {
      name: 'Intelligent Retirement',
      contactMethods: [
        {
          preferred: true,
          contactMethodDetails: {
            url: 'https://intelligentretirement.co.uk',
          },
        },
      ],
    },
    employmentMembershipPeriods: [
      {
        employerName: 'Fry & Tingle',
        employerStatus: 'C',
        membershipStartDate: '2008-04-01',
        membershipEndDate: '',
      },
    ],
    pensionCategory: 'CONFIRMED',
    hasIncome: true,
    group: 'green',
    detailData: {
      monthlyAmount: 2639.83,
      retirementDate: '2040-10-23',
      lumpSumPayableDate: '2040-10-23',
      lumpSumAmount: 126712,
      benefitType: 'DB',
      warnings: [],
      incomeAndValues: [
        {
          bar: {
            eri: {
              monthlyAmount: 2639.83,
              annualAmount: 31678,
              payableDate: '2040-10-23',
              benefitType: 'DB',
              survivorBenefit: true,
              safeguardedBenefit: true,
              increasing: true,
              calculationMethod: 'BS',
              warnings: ['UNP'],
            },
            ap: {
              monthlyAmount: 1999.75,
              annualAmount: 23997,
              payableDate: '2025-09-05',
              benefitType: 'DB',
              safeguardedBenefit: false,
              survivorBenefit: false,
              calculationMethod: 'BS',
              warnings: [],
            },
            illustrationDate: '2025-09-05',
          },
          donut: {
            eri: {
              amount: 126712,
              payableDate: '2040-10-23',
              benefitType: 'DB',
              safeguardedBenefit: true,
              survivorBenefit: true,
              calculationMethod: 'BS',
              warnings: ['UNP'],
            },
            ap: {
              amount: 14800,
              payableDate: '2025-09-05',
              benefitType: 'DB',
              safeguardedBenefit: true,
              survivorBenefit: true,
              calculationMethod: 'BS',
              warnings: ['UNP'],
            },
            illustrationDate: '2025-09-05',
          },
        },
      ],
    },
  },
];

export const mockHybridPending = [
  {
    externalPensionPolicyId: 'D2007659822',
    externalAssetId: '0fbdfff5-6016-4e5c-8179-547b0dad2d38',
    schemeName: 'Trafford Pension Fund',
    contributionsFromMultipleEmployers: false,
    matchType: 'DEFN',
    retirementDate: '2032-08-13',
    dateOfBirth: '1965-08-13',
    pensionType: 'HYB',
    pensionOrigin: 'WM',
    pensionStatus: 'A',
    contactReference: 'TRAFF1PP',
    startDate: '2008-04-01',
    pensionAdministrator: {
      name: 'Trafford Pension Solutions',
      contactMethods: [
        {
          preferred: true,
          contactMethodDetails: { url: 'https://tpf.gov.uk' },
        },
      ],
    },
    employmentMembershipPeriods: [
      {
        employerName: 'Trafford Community Action',
        employerStatus: 'C',
        membershipStartDate: '2008-04-01',
      },
    ],
    pensionCategory: 'PENDING',
    group: 'yellow',
  },
];

export const mockTimelineData = {
  keys: ['SP', 'DB', 'DC', 'AVC', 'HYB', 'LU'],
  years: [
    {
      year: 2030,
      monthlyTotal: 800,
      annualTotal: 9600,
      arrangements: [
        {
          id: '43d18f1f-2453-4542-85d0-5ca00b7d6430',
          schemeName: 'Short pension that stops',
          pensionType: 'DB',
          monthlyAmount: 800,
          startYear: 2030,
          endYear: 2031,
        },
      ],
    },
    {
      year: 2031,
      monthlyTotal: 0,
      annualTotal: 0,
      arrangements: [],
    },
    {
      year: 2037,
      monthlyTotal: 1458.5,
      annualTotal: 17490,
      arrangements: [
        {
          id: '43d18f1f-2453-4542-85d0-5ca00b7d6430',
          schemeName: 'State Pension',
          pensionType: 'SP',
          monthlyAmount: 958.5,
          startYear: 2037,
          endYear: null,
        },
        {
          id: '43d18f1f-2453-4542-85d0-5ca00b7d6430',
          schemeName: 'SilverTree Future Fund',
          pensionType: 'DC',
          monthlyAmount: 500,
          startYear: 2037,
          endYear: null,
        },
      ],
    },
    {
      year: 2045,
      monthlyTotal: 3658.5,
      annualTotal: 43890,
      arrangements: [
        {
          id: '43d18f1f-2453-4542-85d0-5ca00b7d6430',
          schemeName: 'State Pension',
          pensionType: 'SP',
          monthlyAmount: 958.5,
          startYear: 2037,
          endYear: null,
        },
        {
          id: '43d18f1f-2453-4542-85d0-5ca00b7d6430',
          schemeName: 'SilverTree Future Fund',
          pensionType: 'DC',
          monthlyAmount: 500,
          startYear: 2037,
          endYear: null,
        },
        {
          id: '17eb1ed4-d9da-49be-8262-9c6f0ec5f517',
          schemeName: 'Horizon Lifetime Plan',
          pensionType: 'HYB',
          monthlyAmount: 800,
          startYear: 2045,
          endYear: null,
        },
        {
          id: 'bb139b3d-eadf-41d3-8c6e-196c6fbc825c',
          schemeName: 'Summit Gold Pension',
          pensionType: 'AVC',
          monthlyAmount: 200,
          startYear: 2045,
          endYear: null,
        },
        {
          id: '9d14aedd-4f9e-48de-a532-59cbb9a88fa9',
          schemeName: 'Oakfield Secure Pension',
          pensionType: 'DB',
          monthlyAmount: 1200,
          lumpSumAmount: 50000,
          lumpSumYear: 2045,
          startYear: 2045,
          endYear: null,
        },
      ],
    },
  ],
};

export const mockChartIllustration = {
  eri: {
    increasing: true,
    survivorBenefit: false,
    safeguardedBenefit: true,
    warnings: ['UNP'],
    calculationMethod: 'SMPI',
    benefitType: 'DC',
  },
  ap: {
    safeguardedBenefit: false,
    survivorBenefit: false,
    warnings: [],
    calculationMethod: 'SMPI',
    benefitType: 'DC',
  },
} as ChartIllustration;
