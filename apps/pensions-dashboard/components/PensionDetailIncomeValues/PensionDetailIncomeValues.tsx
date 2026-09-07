import { Fragment, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';
import {
  H3,
  Heading,
  Icon,
  IconType,
  Level,
  Paragraph,
} from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  CHARTS_NO_DATE_FALLBACK,
  MatchType,
  PensionType,
} from '../../lib/constants';
import { BuiltIllustration, PensionArrangement } from '../../lib/types';
import {
  buildChartIllustrations,
  hasMultipleBenefitTypes,
  hasSpecificChartType,
  sortAndCombine,
  sortByBarAmountDesc,
} from '../../lib/utils/data';
import {
  formatDate,
  getChartMcCloudVariables,
  tooltipScreenReaderText,
} from '../../lib/utils/ui';
import { DonutChart } from '../DonutChart';
import { IncomeBarChart } from '../IncomeBarChart';
import { IncomeValuesAccordions } from '../IncomeValuesAccordions';
import { IncomeValuesTimeline } from '../IncomeValuesTimeline';
import { PensionDetailHeading } from '../PensionDetailHeading';
import { PensionDetailValuesAccordion } from '../PensionDetailValuesAccordion';

type DetailsIncomeValues = {
  data: PensionArrangement;
};

type Grouping = {
  title: string;
  calcType: PensionType;
  items: BuiltIllustration[];
};

const WarningMessage = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId: string;
}) => {
  return (
    <div
      className="px-4 pt-8 pb-6 mt-3 bg-blue-100 lg:mt-6 lg:p-8 rounded-bl-3xl lg:mx-2"
      data-testid={testId}
    >
      <div className="flex items-start content-start">
        <div className="w-[30px] h-[30px] mr-4">
          <Icon
            type={IconType.WARNING_SQUARE}
            className="text-blue-700 w-[30px] h-[30px]"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

const getUnavailableCodes = (item: BuiltIllustration, type: 'bar' | 'donut') =>
  Array.from(
    new Set(
      [
        item[type]?.eri?.unavailableReason,
        item[type]?.ap?.unavailableReason,
      ].filter(Boolean),
    ),
  );

const ChartCard = ({
  item,
  year,
  grouping,
  data,
  index,
  type,
  headingLevel,
}: {
  item: BuiltIllustration;
  year: number;
  grouping: Grouping;
  data: PensionArrangement;
  index: number;
  type: 'bar' | 'donut';
  headingLevel: number;
}) => {
  const { t, locale } = useTranslation();

  const boxClasses =
    'border-2 border-slate-400 rounded-lg lg:col-span-1 max-lg:mb-6';
  const { apBar, eriBar, apDonut, eriDonut } = item;
  const isBar = apBar && eriBar;
  const isDonut = apDonut && eriDonut;
  const unavailableCodes = getUnavailableCodes(item, type);

  const { isMcCloud, isLegacy, isAlternative } = getChartMcCloudVariables(
    item,
    type,
  );

  const chartHeadingLevel = isMcCloud
    ? (`h${headingLevel + 1}` as Level)
    : (`h${headingLevel}` as Level);

  return (
    <div
      data-testid={`${year}-${grouping.calcType.toLowerCase()}-${type}-${index}`}
      className={twMerge(
        boxClasses,
        type === 'bar' ? 'lg:min-h-[464px]' : 'lg:min-h-[432px]',
        isMcCloud && 'pt-0',
      )}
    >
      {isMcCloud && (
        <Heading
          level={`h${headingLevel}` as Level}
          data-testid="mccloud-heading"
          className={twMerge(
            'px-4 md:px-6 py-1 rounded-t-md mb-0 font-bold text-gray-450 bg-gray-350 !text-base !leading-[2]',
            isLegacy && 'text-white bg-gray-450',
          )}
        >
          {isLegacy && t('components.income-timeline.legacy')}
          {isAlternative && t('components.income-timeline.alternative')}{' '}
          {t('components.income-timeline.option')}
        </Heading>
      )}

      <div className={twMerge('px-4 py-5', isMcCloud && 'pt-3')}>
        {type === 'bar' && isBar && (
          <IncomeBarChart
            ap={apBar}
            eri={eriBar}
            calcType={item.calcType}
            headingLevel={chartHeadingLevel}
          />
        )}

        {type === 'donut' && isDonut && (
          <DonutChart
            ap={apDonut}
            eri={eriDonut}
            calcType={item.calcType}
            headingLevel={chartHeadingLevel}
          />
        )}

        {unavailableCodes.length > 0 &&
          unavailableCodes.map((code, idx) => (
            <WarningMessage
              testId={`unavailable-reason-${year}-${index}-${idx}`}
              key={`unavailable-${type}-${year}-${index}-${idx}`}
            >
              <Markdown
                className="mb-0 leading-[1.6]"
                content={t(`data/unavailable-reasons.${code}`, {
                  pensionProvider: data.pensionAdministrator?.name,
                })}
              />
            </WarningMessage>
          ))}

        {type === 'bar' && item.bar?.eri?.lastPaymentDate && (
          <WarningMessage testId={`last-payment-${index}`}>
            <Paragraph className="mb-0 leading-[1.6]">
              {t('pages.pension-details.details.benefit-stops')}{' '}
              <strong>
                {formatDate(item.bar.eri.lastPaymentDate, locale)}
              </strong>
            </Paragraph>
          </WarningMessage>
        )}

        <IncomeValuesAccordions item={item} type={type} />
      </div>
    </div>
  );
};

export const PensionDetailIncomeValues = ({ data }: DetailsIncomeValues) => {
  const { t } = useTranslation();

  const isSysOrNewMatch =
    data.matchType === MatchType.SYS || data.matchType === MatchType.NEW;

  // build the illustrations object which contains all the necessary data for the charts and details
  const builtItems: BuiltIllustration[] = buildChartIllustrations(data);

  // grouping by year
  const groupedByYear: Record<number, BuiltIllustration[]> = {};

  builtItems.forEach((item) => {
    if (!groupedByYear[item.payableYear]) groupedByYear[item.payableYear] = [];
    groupedByYear[item.payableYear].push(item);
  });

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => a - b);

  const showProviderDataIssue =
    isSysOrNewMatch && !sortedYears.length && !data.pensionType;

  const showBenefitTypeTitle =
    hasMultipleBenefitTypes(data.benefitIllustrations) ||
    !data.pensionType ||
    data.pensionType === PensionType.HYB ||
    data.pensionType === PensionType.VAR;

  const showYearTitle = data.hasMultipleTranches || sortedYears.length > 1;

  const chartHeadingLevel =
    3 + (showYearTitle ? 1 : 0) + (showBenefitTypeTitle ? 1 : 0);

  const benefitTypeHeadingLevel = showYearTitle ? 'h4' : 'h3';

  const hasDCChartType = hasSpecificChartType(data, PensionType.DC);

  return (
    <section>
      <PensionDetailHeading
        title={t('pages.pension-details.headings.income-and-values')}
      />

      <div className="mt-4 lg:grid lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
          {showProviderDataIssue ? (
            <Paragraph
              data-testid="sys-new-no-benefit-type-message"
              className="mb-12 leading-[1.6]"
            >
              {t(`data/unavailable-reasons.${data.matchType}_MATCHTYPE`)}
            </Paragraph>
          ) : (
            <>
              <IncomeValuesTimeline data={data} />

              <Paragraph data-testid="sub-heading" className="leading-[1.6]">
                {t('pages.pension-details.headings.income-and-values-sub')}
              </Paragraph>

              {hasDCChartType && (
                <Markdown
                  testId="sub-heading-dc"
                  className="leading-[1.6]"
                  content={t(
                    'pages.pension-details.headings.income-and-values-sub-dc',
                  )}
                />
              )}

              {sortedYears.length > 0 && (
                <PensionDetailValuesAccordion
                  contentKey="income-and-values"
                  className="mb-8"
                  testId="value-illustration-date-accordion"
                />
              )}

              {isSysOrNewMatch && (
                <Paragraph
                  data-testid="sys-new-values-warning"
                  className="mb-8 leading-[1.6]"
                >
                  {t(
                    'pages.pension-details.headings.income-and-values-warning',
                  )}
                </Paragraph>
              )}
            </>
          )}
        </div>
      </div>

      {sortedYears.map((year) => {
        const group = groupedByYear[year];

        // Group items by calcType within the year
        const groupedByCalcType: Record<PensionType, BuiltIllustration[]> = {
          [PensionType.DB]: [],
          [PensionType.DC]: [],
          [PensionType.AVC]: [],
          [PensionType.HYB]: [],
          [PensionType.CB]: [],
          [PensionType.CDC]: [],
          [PensionType.VAR]: [],
          [PensionType.SP]: [],
        };

        group.forEach((item) => {
          groupedByCalcType[item.calcType]?.push(item);
        });

        // Sort DB separately into recurring and lump sums
        const dbItems = sortAndCombine(
          groupedByCalcType[PensionType.DB],
          PensionType.DB,
        );
        const cdcItems = sortAndCombine(
          groupedByCalcType[PensionType.CDC],
          PensionType.CDC,
        );
        const dcItems =
          groupedByCalcType[PensionType.DC].toSorted(sortByBarAmountDesc);
        const avcItems =
          groupedByCalcType[PensionType.AVC].toSorted(sortByBarAmountDesc);
        const hybItems =
          groupedByCalcType[PensionType.HYB].toSorted(sortByBarAmountDesc);
        const cbItems =
          groupedByCalcType[PensionType.CB].toSorted(sortByBarAmountDesc);

        const calcTypeGroups: Grouping[] = [
          {
            title: t('pages.pension-details.chart-sections.DB'),
            calcType: PensionType.DB,
            items: dbItems,
          },
          {
            title: t('pages.pension-details.chart-sections.CDC'),
            calcType: PensionType.CDC,
            items: cdcItems,
          },
          {
            title: t('pages.pension-details.chart-sections.DC'),
            calcType: PensionType.DC,
            items: dcItems,
          },
          {
            title: t('pages.pension-details.chart-sections.AVC'),
            calcType: PensionType.AVC,
            items: avcItems,
          },
          {
            title: t('pages.pension-details.chart-sections.HYB'),
            calcType: PensionType.HYB,
            items: hybItems,
          },
          {
            title: t('pages.pension-details.chart-sections.CB'),
            calcType: PensionType.CB,
            items: cbItems,
          },
        ];

        return (
          <div
            key={year}
            data-testid={`year-${year}`}
            className="mb-6 lg:mb-12"
          >
            {showYearTitle && (
              <H3
                className={twMerge(
                  'mb-4 font-semibold lg:mb-10',
                  showBenefitTypeTitle && 'mb-0 lg:mb-4',
                )}
              >
                {year === CHARTS_NO_DATE_FALLBACK
                  ? t('common.unavailable')
                  : year}
              </H3>
            )}

            {calcTypeGroups.map(
              (grouping, index) =>
                grouping.items.length > 0 && (
                  <div
                    data-testid={`benefit-group-${grouping.calcType.toLowerCase()}`}
                    key={`benefit-group-${index}`}
                    className="mb-6 lg:mb-16"
                  >
                    {showBenefitTypeTitle && (
                      <Heading
                        level={benefitTypeHeadingLevel}
                        className="mb-4 font-semibold lg:mb-10"
                        data-testid={`benefit-type-title-${grouping.calcType.toLowerCase()}`}
                      >
                        {grouping.title}{' '}
                        {
                          <Markdown
                            data-testid="markdown"
                            className="[&_>span]:left-[5px]"
                            disableParagraphs
                            content={t(`tooltips.type-${grouping.calcType}`)}
                            tooltipProps={{
                              accessibilityLabelOpen: tooltipScreenReaderText(
                                t(`tooltips.sr-text.type-${grouping.calcType}`),
                                t,
                              ),
                            }}
                          />
                        }
                      </Heading>
                    )}
                    <div className="items-start lg:grid lg:grid-cols-2 lg:gap-8">
                      {grouping.items.map((item, index) => {
                        const { apBar, eriBar, apDonut, eriDonut } = item;
                        const hasBar = apBar && eriBar;
                        const hasDonut = apDonut && eriDonut;
                        return (
                          <Fragment key={`group-${index}`}>
                            {hasBar && (
                              <ChartCard
                                item={item}
                                year={year}
                                grouping={grouping}
                                data={data}
                                index={index}
                                type="bar"
                                headingLevel={chartHeadingLevel}
                              />
                            )}
                            {hasDonut && (
                              <ChartCard
                                item={item}
                                year={year}
                                grouping={grouping}
                                data={data}
                                index={index}
                                type="donut"
                                headingLevel={chartHeadingLevel}
                              />
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>
                ),
            )}
          </div>
        );
      })}
    </section>
  );
};
