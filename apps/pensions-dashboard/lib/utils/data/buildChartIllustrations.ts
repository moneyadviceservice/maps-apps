import {
  CHARTS_NO_DATE_FALLBACK,
  IllustrationType,
  PayableDetailsType,
  PensionType,
} from '../../constants';
import {
  AmountNotProvidedDetails,
  BenefitIllustrationComponent,
  BuiltIllustration,
  LumpSumDetails,
  PensionArrangement,
  RecurringIncomeDetails,
} from '../../types';
import { getCalculationType } from './getCalculationType';

const emptyChartData = {
  annualAmount: 0,
  monthlyAmount: 0,
  safeguardedBenefit: false,
  survivorBenefit: false,
  warnings: [],
};

const emptyBar = {
  annualAmount: 0,
  monthlyAmount: 0,
  lastPaymentDate: undefined,
};

const emptyDonut = { amount: 0 };

export const buildChartIllustrations = (
  data: PensionArrangement,
): BuiltIllustration[] => {
  const getPayableYear = (date?: string) =>
    date ? new Date(date).getFullYear() : CHARTS_NO_DATE_FALLBACK;

  const createCommonData = (component: BenefitIllustrationComponent) => ({
    payableDate: component?.payableDetails?.payableDate,
    survivorBenefit: component?.survivorBenefit ?? false,
    safeguardedBenefit: component?.safeguardedBenefit ?? false,
    warnings: component?.illustrationWarnings ?? [],
    benefitType: component?.benefitType,
    calculationMethod: component?.calculationMethod,
    unavailableReason:
      component?.unavailableReason ??
      (component?.payableDetails as AmountNotProvidedDetails)?.reason,
    amountType: component?.payableDetails
      ? (component.payableDetails as RecurringIncomeDetails)?.amountType ??
        (component.payableDetails as LumpSumDetails)?.amountType
      : undefined,
    increasing:
      (component?.payableDetails as RecurringIncomeDetails)?.increasing ??
      false,
  });

  const createBar = (component: BenefitIllustrationComponent) => ({
    ...createCommonData(component),
    monthlyAmount:
      (component?.payableDetails as RecurringIncomeDetails)?.monthlyAmount ?? 0,
    annualAmount:
      (component?.payableDetails as RecurringIncomeDetails)?.annualAmount ?? 0,
    lastPaymentDate: (component?.payableDetails as RecurringIncomeDetails)
      ?.lastPaymentDate,
  });

  const createDonut = (
    component: BenefitIllustrationComponent,
    isLumpSum: boolean,
  ) => ({
    ...createCommonData(component),
    amount: isLumpSum
      ? (component?.payableDetails as LumpSumDetails)?.amount ?? 0
      : component?.dcPot ?? 0,
  });

  const builtItems: BuiltIllustration[] = [];

  if (data.benefitIllustrations?.length) {
    data.benefitIllustrations.forEach((illustration) => {
      let eriComponent = {} as BenefitIllustrationComponent;
      let apComponent = {} as BenefitIllustrationComponent;

      illustration.illustrationComponents.forEach((component) => {
        if (component.illustrationType === IllustrationType.ERI)
          eriComponent = component;
        else apComponent = component;
      });

      const calcType = getCalculationType(
        data.pensionType,
        eriComponent?.benefitType ?? apComponent?.benefitType,
      );

      const isLumpSum =
        illustration.payableDetailsType === PayableDetailsType.LUMPSUM;

      const shouldHaveDonut =
        isLumpSum ||
        calcType === PensionType.DC ||
        calcType === PensionType.AVC;

      const bar = isLumpSum
        ? undefined
        : {
            eri: createBar(eriComponent),
            ap: createBar(apComponent),
          };

      const donut = shouldHaveDonut
        ? {
            eri: createDonut(eriComponent, isLumpSum),
            ap: createDonut(apComponent, isLumpSum),
          }
        : undefined;

      const eriDate = bar?.eri?.payableDate ?? donut?.eri?.payableDate;
      const apDate = bar?.ap?.payableDate ?? donut?.ap?.payableDate;
      const payableYear = getPayableYear(eriDate ?? apDate);

      builtItems.push({
        bar,
        donut,
        apBar: bar
          ? {
              annualAmount: bar.ap?.annualAmount ?? 0,
              monthlyAmount: bar.ap?.monthlyAmount ?? 0,
              date: illustration.illustrationDate,
            }
          : undefined,
        eriBar: bar
          ? {
              annualAmount: bar.eri?.annualAmount ?? 0,
              monthlyAmount: bar.eri?.monthlyAmount ?? 0,
              date: bar.eri?.payableDate ?? bar.ap?.payableDate,
            }
          : undefined,
        apDonut: donut
          ? {
              amount: donut.ap?.amount ?? 0,
              date: illustration.illustrationDate,
            }
          : undefined,
        eriDonut: donut
          ? {
              amount: donut.eri?.amount ?? 0,
              date: donut.eri?.payableDate ?? donut.ap?.payableDate,
            }
          : undefined,
        calcType,
        payableYear,
        illustrationDate: illustration.illustrationDate,
      });
    });
  } else {
    const calcType = getCalculationType(data.pensionType);
    const isDb = calcType === PensionType.DB;
    builtItems.push({
      bar: { eri: emptyChartData, ap: emptyChartData },
      donut: isDb ? undefined : { eri: emptyChartData, ap: emptyChartData },
      apBar: emptyBar,
      eriBar: emptyBar,
      apDonut: isDb ? undefined : emptyDonut,
      eriDonut: isDb ? undefined : emptyDonut,
      calcType,
      payableYear: CHARTS_NO_DATE_FALLBACK,
      illustrationDate: undefined,
    });
  }

  return builtItems;
};
