import { Fragment } from 'react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { getCalculationType } from '../../lib/utils/data';
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

  return (
    <section>
      <PensionDetailHeading
        title={t('pages.pension-details.headings.income-and-values')}
        subHeading={t('pages.pension-details.headings.income-and-values-sub')}
      />

      {data.detailData?.incomeAndValues?.map((illustration, index) => {
        const { bar, donut } = illustration;

        const calcType = getCalculationType(
          data.pensionType,
          bar.eri.benefitType,
        );

        const apBar = {
          annualAmount: bar.ap.annualAmount ?? 0,
          monthlyAmount: bar.ap.monthlyAmount ?? 0,
          date: bar.illustrationDate ?? undefined,
        };

        const eriBar = {
          annualAmount: bar.eri.annualAmount ?? 0,
          monthlyAmount: bar.eri.monthlyAmount ?? 0,
          date: bar.eri.payableDate ?? data.detailData?.retirementDate,
        };

        const apDonutData = donut
          ? {
              amount: donut.ap.amount ?? 0,
              date: donut.illustrationDate ?? undefined,
            }
          : undefined;

        const eriDonutData = donut
          ? {
              amount: donut.eri.amount ?? 0,
              date: donut.eri.payableDate ?? data.detailData?.retirementDate,
            }
          : undefined;

        return (
          <Fragment key={index}>
            <div className="items-start mb-10 lg:grid lg:grid-cols-2 lg:gap-4">
              <div className="p-4 py-5 border-2 border-slate-400 rounded-lg lg:col-span-1 lg:min-h-[432px]">
                <IncomeBarChart
                  ap={apBar}
                  eri={eriBar}
                  pensionType={data.pensionType}
                />
                {calcType === PensionType.DB && (
                  <div
                    data-testid="db-calculation-accordion"
                    className="mt-3 lg:mt-6 lg:px-2"
                  >
                    <EstimateCalculationAccordion
                      illustration={bar}
                      calcType={calcType}
                    />
                  </div>
                )}
                <DetailFeatures illustration={bar} />
                <MoreDetails illustration={bar} />
              </div>

              {donut &&
                eriDonutData &&
                apDonutData &&
                (calcType === PensionType.AVC ||
                  calcType === PensionType.DC ||
                  (calcType === PensionType.DB && donut)) && (
                  <div className="p-4 py-5 border-2 border-slate-400 rounded-lg lg:col-span-1 lg:min-h-[432px] max-lg:mt-6">
                    <DonutChart
                      ap={apDonutData}
                      eri={eriDonutData}
                      pensionType={data.pensionType}
                      calcType={calcType}
                    />
                    {calcType === PensionType.DB && donut && (
                      <>
                        <div
                          data-testid="db-lump-sum-calculation-accordion"
                          className="mt-3 lg:mt-6 lg:px-2"
                        >
                          <EstimateCalculationAccordion
                            illustration={donut}
                            calcType={calcType}
                          />
                        </div>
                        <DetailFeatures illustration={donut} />
                        <MoreDetails illustration={donut} />
                      </>
                    )}
                  </div>
                )}
            </div>

            {(calcType === PensionType.AVC || calcType === PensionType.DC) && (
              <div
                data-testid="dc-calculation-accordion"
                className="mb-6 lg:grid lg:grid-cols-12 lg:gap-4"
              >
                <div className="lg:col-span-8 2xl:col-span-7">
                  <EstimateCalculationAccordion
                    illustration={bar}
                    calcType={calcType}
                  />
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </section>
  );
};
