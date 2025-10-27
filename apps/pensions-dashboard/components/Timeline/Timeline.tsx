import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationType } from '../../lib/constants';
import {
  LumpSumDetails,
  PensionArrangement,
  RecurringIncomeDetails,
} from '../../lib/types';
import {
  currencyAmount,
  getLatestIllustration,
  getLumpSumIllustration,
} from '../../lib/utils';
import { Pension, TimelineEntry } from './TimelineEntry';

type TimelineProps = {
  data: PensionArrangement[];
};

// Returns all active pensions for a given year
const getActiveArrangementsForYear = (pensions: Pension[], year: number) => {
  return pensions
    .filter((p) => {
      const startYear = new Date(p.payableDate).getFullYear();
      const endYear = p.lastPayableDate
        ? new Date(p.lastPayableDate).getFullYear()
        : null;
      return startYear <= year && (!endYear || endYear >= year);
    })
    .sort(
      (a, b) =>
        new Date(a.payableDate).getTime() - new Date(b.payableDate).getTime(),
    );
};

const buildRecurringPension = (
  pension: PensionArrangement,
  details: RecurringIncomeDetails,
): Pension => ({
  id: pension.externalAssetId,
  schemeName: pension.schemeName,
  pensionType: pension.pensionType,
  payableDate: details.payableDate ?? pension.retirementDate,
  lastPayableDate: details.lastPaymentDate ?? null,
  monthlyAmount: details.monthlyAmount,
  annualAmount: details.annualAmount,
});

const buildLumpSumPension = (
  pension: PensionArrangement,
  details: LumpSumDetails,
): Pension => {
  const lumpYear = new Date(details.payableDate).getFullYear();
  return {
    id: pension.externalAssetId + '-lump-' + lumpYear,
    schemeName: pension.schemeName,
    pensionType: pension.pensionType,
    payableDate: details.payableDate,
    lastPayableDate: details.payableDate,
    lumpSumAmount: details.amount,
    lumpSumPayableDate: details.payableDate,
  };
};

const addRecurringIfPresent = (
  pensionsMap: { [key: string]: Pension },
  pension: PensionArrangement,
) => {
  const illustration = getLatestIllustration(IllustrationType.ERI, pension);
  if (illustration && 'annualAmount' in illustration.payableDetails) {
    pensionsMap[pension.externalAssetId] = buildRecurringPension(
      pension,
      illustration.payableDetails,
    );
  }
};

const attachOrAddLumpSum = (
  pensionsMap: { [key: string]: Pension },
  pension: PensionArrangement,
) => {
  const lumpSumIllustration = getLumpSumIllustration(
    IllustrationType.ERI,
    pension.benefitIllustrations,
  );
  if (!lumpSumIllustration) return;

  const payableDetails = lumpSumIllustration.payableDetails as LumpSumDetails;
  const lumpYear = new Date(payableDetails.payableDate).getFullYear();
  const existing = pensionsMap[pension.externalAssetId];

  if (existing) {
    const startYear = new Date(existing.payableDate).getFullYear();
    const endYear = existing.lastPayableDate
      ? new Date(existing.lastPayableDate).getFullYear()
      : startYear;

    if (lumpYear >= startYear && lumpYear <= endYear) {
      Object.assign(existing, {
        lumpSumAmount: payableDetails.amount,
        lumpSumPayableDate: payableDetails.payableDate,
      });
      return;
    }
  }

  pensionsMap[pension.externalAssetId + '-lump-' + lumpYear] =
    buildLumpSumPension(pension, payableDetails);
};

const getPensions = (data: PensionArrangement[]) => {
  const pensionsMap: { [key: string]: Pension } = {};

  for (const pension of data) {
    addRecurringIfPresent(pensionsMap, pension);
    attachOrAddLumpSum(pensionsMap, pension);
  }

  const pensions: Pension[] = Object.values(pensionsMap);
  return pensions;
};

const getTimelineValues = (
  pensions: Pension[],
  changeYearsSet: Set<number>,
) => {
  const uniqueYears = Array.from(changeYearsSet).sort((a, b) => a - b);
  return uniqueYears.map((year) => {
    const activeArrangements = getActiveArrangementsForYear(pensions, year);

    const { monthlyTotal, annualTotal, arrangementsToShow } =
      activeArrangements.reduce(
        (acc, p) => {
          if (p.monthlyAmount || p.annualAmount || p.lumpSumAmount) {
            acc.arrangementsToShow.push(p);
          }
          acc.monthlyTotal += p.monthlyAmount ?? 0;
          acc.annualTotal += p.annualAmount ?? 0;
          return acc;
        },
        {
          monthlyTotal: 0,
          annualTotal: 0,
          arrangementsToShow: [] as Pension[],
        },
      );

    return {
      year: String(year),
      arrangements: arrangementsToShow,
      monthlyTotal,
      annualTotal,
    };
  });
};

const getChangeYears = (pensions: Pension[]) => {
  const changeYearsSet = new Set<number>();
  for (const p of pensions) {
    const startYear = new Date(p.payableDate).getFullYear();
    const lumpSumYear = p.lumpSumPayableDate
      ? new Date(p.lumpSumPayableDate).getFullYear()
      : null;
    const endYear =
      p.lastPayableDate && (p.monthlyAmount || p.annualAmount)
        ? new Date(p.lastPayableDate).getFullYear()
        : null;

    changeYearsSet.add(startYear); // always include start year
    if (lumpSumYear) changeYearsSet.add(lumpSumYear); // lump sum only in its year
    if (endYear) changeYearsSet.add(endYear + 1); // only recurring payments create "end year + 1"
  }

  return changeYearsSet;
};

export const Timeline = ({ data }: TimelineProps) => {
  const { t } = useTranslation();
  const beforeClasses = [
    "before:content-['']",
    'before:absolute',
    'before:top-0',
    'before:left-[-8px]',
    'before:w-[14px]',
    'before:h-[14px]',
    'before:bg-black',
    'before:rounded-full',
    'lg:before:left-[-9px]',
    'lg:before:w-[16px]',
    'lg:before:h-[16px]',
  ];

  const afterClasses = [
    "after:content-['']",
    'after:absolute',
    'after:bottom-0',
    'after:h-[40px]',
    'after:w-[2px]',
    'after:left-[-2px]',
    'after:bg-gradient-to-b',
    'after:from-black',
    'after:to-white',
  ];

  const pensions = getPensions(data);
  const changeYearsSet = getChangeYears(pensions);
  const timeline = getTimelineValues(pensions, changeYearsSet);

  if (timeline.length === 0) return null;

  return (
    <ol data-testid="timeline" className="my-8 max-lg:ml-1">
      {timeline.map((entry, i) => {
        const { year, monthlyTotal, annualTotal, arrangements } = entry;
        const numberOfArrangements = arrangements.length;
        const isLastLi = i === timeline.length - 1;

        return (
          <li
            key={year}
            className="lg:flex max-lg:border-l-2 max-lg:border-black max-lg:pb-5 max-lg:relative max-lg:pl-4 last:pb-0"
          >
            <p
              data-testid={`timeline-year-${year}`}
              className="lg:w-[152px] relative top-[-9px] lg:top-[-12px] text-[20px] lg:text-2xl capitalize"
            >
              {t('common.year')}: <span className="font-bold">{year}</span>
            </p>
            <div
              className={twMerge(
                'lg:border-l-2 lg:border-black lg:pb-14 lg:relative lg:pl-12',
                isLastLi && 'lg:pb-0',
                beforeClasses,
                isLastLi && afterClasses,
              )}
            >
              <div className="relative top-[-11px] lg:top-[-22px]">
                <p className="text-[26px] max-lg:mt-2 max-lg:leading-[1.5] lg:text-4xl">
                  <strong data-testid="timeline-year-monthly">
                    {currencyAmount(monthlyTotal)}
                  </strong>{' '}
                  {t('common.a-month')} {t('common.or')}{' '}
                  <strong data-testid="timeline-year-annual">
                    {currencyAmount(annualTotal)}
                  </strong>{' '}
                  {t('common.a-year')}
                </p>

                {numberOfArrangements > 0 && (
                  <ExpandableSection
                    title={`${t(
                      'pages.your-pensions-timeline.view-pensions',
                    )} (${numberOfArrangements})`}
                    closedTitle={`${t(
                      'pages.your-pensions-timeline.hide-pensions',
                    )} (${numberOfArrangements})`}
                    testId={`timeline-accordion-${year}`}
                  >
                    <ol className="mt-4 lg:mt-6">
                      {arrangements.map((arrangement) => {
                        return (
                          <TimelineEntry
                            key={arrangement.id}
                            arrangement={arrangement}
                            year={year}
                          />
                        );
                      })}
                    </ol>
                  </ExpandableSection>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
