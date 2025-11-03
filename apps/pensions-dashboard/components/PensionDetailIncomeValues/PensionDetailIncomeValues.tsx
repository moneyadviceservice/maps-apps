import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationType, PensionType } from '../../lib/constants';
import {
  LumpSumDetails,
  PensionArrangement,
  RecurringIncomeDetails,
} from '../../lib/types';
import {
  getLatestIllustration,
  getLumpSumBenefitIllustration,
  getLumpSumIllustration,
  getMostRecentBenefitIllustration,
  getRetirementDate,
} from '../../lib/utils/data';
import { formatDate } from '../../lib/utils/ui';
import { DetailFeatures } from '../DetailFeatures';
import { DonutChart } from '../DonutChart';
import { EstimateCalculationAccordion } from '../EstimateCalculationAccordion';
import { IncomeBarChart } from '../IncomeBarChart';
import { MoreDetails } from '../MoreDetails';
import { PensionDetailHeading } from '../PensionDetailHeading';

type DetailsIncomeValues = {
  data: PensionArrangement;
};

export const PensionDetailIncomeValues = ({ data }: DetailsIncomeValues) => {
  const { t } = useTranslation();
  const benefitIllustration = getMostRecentBenefitIllustration(
    data.benefitIllustrations,
  );

  const lumpSumBenefitIllustration = getLumpSumBenefitIllustration(
    data.benefitIllustrations,
  );

  const createBarValues = (type: IllustrationType) => {
    const latest = getLatestIllustration(type, data);

    return {
      monthly:
        (latest?.payableDetails as RecurringIncomeDetails)?.monthlyAmount ?? 0,
      annual:
        (latest?.payableDetails as RecurringIncomeDetails)?.annualAmount ?? 0,
    };
  };

  const createDonutValues = (type: IllustrationType) => {
    const illustration =
      data.pensionType === PensionType.DB
        ? getLumpSumIllustration(type, data.benefitIllustrations)
        : getLatestIllustration(type, data);

    return {
      amount:
        data.pensionType === PensionType.DB
          ? (illustration?.payableDetails as LumpSumDetails)?.amount ?? 0
          : illustration?.dcPot ?? 0,
    };
  };

  const ap = createBarValues(IllustrationType.AP);
  const eri = createBarValues(IllustrationType.ERI);

  const apBar = {
    date: benefitIllustration?.illustrationDate ?? undefined,
    annualAmount: ap.annual,
    monthlyAmount: ap.monthly,
  };

  const eriBar = {
    date: getRetirementDate(data),
    annualAmount: eri.annual,
    monthlyAmount: eri.monthly,
  };

  const apDonut = createDonutValues(IllustrationType.AP);
  const eriDonut = createDonutValues(IllustrationType.ERI);

  const apDonutData = {
    date:
      data.pensionType === PensionType.DB
        ? lumpSumBenefitIllustration?.illustrationDate ?? undefined
        : benefitIllustration?.illustrationDate ?? undefined,
    amount: apDonut.amount,
  };

  const eriDonutData = () => {
    const eriLumpSumIllustration = getLumpSumIllustration(
      IllustrationType.ERI,
      data.benefitIllustrations,
    );
    return {
      date:
        data.pensionType === PensionType.DB
          ? formatDate(eriLumpSumIllustration?.payableDetails.payableDate ?? '')
          : getRetirementDate(data),
      amount: eriDonut.amount,
    };
  };

  return (
    <section>
      <PensionDetailHeading
        title={t('pages.pension-details.headings.income-and-values')}
        subHeading={t('pages.pension-details.headings.income-and-values-sub')}
      />
      <div className="items-start mb-10 lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="p-4 py-5 border-2 border-slate-400 rounded-lg lg:col-span-1 lg:min-h-[432px]">
          <IncomeBarChart
            ap={apBar}
            eri={eriBar}
            pensionType={data.pensionType}
          />
          {data.pensionType === PensionType.DB && (
            <div
              data-testid="db-calculation-accordion"
              className="mt-3 lg:mt-6 lg:px-2"
            >
              <EstimateCalculationAccordion
                illustration={benefitIllustration}
                pensionType={data.pensionType}
              />
            </div>
          )}
          <DetailFeatures illustration={benefitIllustration} />
          <MoreDetails illustration={benefitIllustration} />
        </div>

        {(data.pensionType === PensionType.DC ||
          (data.pensionType === PensionType.DB &&
            lumpSumBenefitIllustration)) && (
          <div className="p-4 py-5 border-2 border-slate-400 rounded-lg lg:col-span-1 lg:min-h-[432px] max-lg:mt-6">
            <DonutChart
              ap={apDonutData}
              eri={eriDonutData()}
              pensionType={data.pensionType}
            />
            {data.pensionType === PensionType.DB &&
              lumpSumBenefitIllustration && (
                <>
                  <div
                    data-testid="db-lump-sum-calculation-accordion"
                    className="mt-3 lg:mt-6 lg:px-2"
                  >
                    <EstimateCalculationAccordion
                      illustration={lumpSumBenefitIllustration}
                      pensionType={data.pensionType}
                    />
                  </div>
                  <DetailFeatures illustration={lumpSumBenefitIllustration} />
                  <MoreDetails illustration={lumpSumBenefitIllustration} />
                </>
              )}
          </div>
        )}
      </div>

      {data.pensionType === PensionType.DC && (
        <div
          data-testid="dc-calculation-accordion"
          className="mb-6 lg:grid lg:grid-cols-12 lg:gap-4"
        >
          <div className="lg:col-span-8 2xl:col-span-7">
            <EstimateCalculationAccordion
              illustration={benefitIllustration}
              pensionType={data.pensionType}
            />
          </div>
        </div>
      )}
    </section>
  );
};
