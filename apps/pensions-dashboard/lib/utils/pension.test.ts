import {
  getPensionTotals,
  getMonthlyAmount,
  getAnnualAmount,
  getMoreInfoMessage,
  getBenefitType,
} from './pension';
import {
  PensionArrangement,
  BenefitIllustration,
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
  AdditionalDataSource,
} from '../types';
import {
  BenefitType,
  CalculationMethod,
  IllustrationType,
  InformationType,
  MatchType,
  PensionType,
} from '../constants';

describe('Pension module', () => {
  test('getPensionTotals should calculate totals correctly', () => {
    const data: PensionArrangement[] = [
      {
        benefitIllustrations: [
          {
            illustrationComponents: [
              {
                illustrationType: IllustrationType.ERI,
                payableDetails: {
                  monthlyAmount: 100,
                  annualAmount: 1200,
                } as RecurringIncomeDetails,
              },
            ],
          } as BenefitIllustration,
        ],
        externalPensionPolicyId: '',
        externalAssetId: '',
        matchType: MatchType.POSS,
        schemeName: '',
        contactReference: '',
        pensionType: PensionType.AVC,
        contributionsFromMultipleEmployers: false,
        pensionAdministrator: {
          name: '',
          contactMethods: [],
        },
      },
    ];

    const totals = getPensionTotals(data);
    expect(totals.monthlyTotal).toBe(100);
    expect(totals.annualTotal).toBe(1200);
  });

  test('getMonthlyAmount should return formatted monthly amount', () => {
    const illustration: BenefitIllustrationComponent = {
      illustrationType: IllustrationType.ERI,
      payableDetails: {
        monthlyAmount: 100,
      } as RecurringIncomeDetails,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    };

    const monthlyAmount = getMonthlyAmount(illustration);
    expect(monthlyAmount).toBe('£100');
  });

  test('getAnnualAmount should return formatted annual amount', () => {
    const illustration: BenefitIllustrationComponent = {
      illustrationType: IllustrationType.ERI,
      payableDetails: {
        annualAmount: 1200,
      } as RecurringIncomeDetails,
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
    };

    const annualAmount = getAnnualAmount(illustration);
    expect(annualAmount).toBe('£1,200');
  });

  test('getMoreInfoMessage should return correct message based on information type', () => {
    const additionalData: AdditionalDataSource = {
      informationType: InformationType.C_AND_C,
      url: '',
    };

    const message = getMoreInfoMessage(additionalData);
    expect(message).toBe(
      'For more information about costs and charges, go to ',
    );

    additionalData.informationType = InformationType.SP;
    const messageSP = getMoreInfoMessage(additionalData);
    expect(messageSP).toBe(
      'For more information about your State Pension, go to ',
    );

    additionalData.informationType = 'UNKNOWN' as InformationType;
    const messageUnknown = getMoreInfoMessage(additionalData);
    expect(messageUnknown).toBe('');
  });

  test('getBenefitType should return correct benefit type description', () => {
    expect(getBenefitType[BenefitType.AVC]).toBe(
      'Additional voluntary contribution',
    );
    expect(getBenefitType[BenefitType.DB]).toBe('Defined Benefit');
    expect(getBenefitType[BenefitType.SP]).toBe('State Pension');
  });
});
