import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';

import { TimelineYear } from '../../lib/types';
import { currencyAmount } from '../../lib/utils/ui';
import { TimelineEntry } from './TimelineEntry';

type TimelineProps = {
  data: TimelineYear[];
};

export const Timeline = ({ data }: TimelineProps) => {
  const { t } = useTranslation();

  if (data.length === 0) return null;

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

  return (
    <ol data-testid="timeline" className="my-8 max-lg:ml-1">
      {data.map((entry, i) => {
        const { year, monthlyTotal, annualTotal, arrangements } = entry;
        const numberOfArrangements = arrangements.length;
        const isLastLi = i === data.length - 1;

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
