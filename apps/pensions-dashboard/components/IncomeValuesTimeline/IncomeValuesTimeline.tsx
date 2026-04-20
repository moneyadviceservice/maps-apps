import { Fragment } from 'react';

import { ListElement, Paragraph } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { IncomeTimeline, PensionArrangement } from '../../lib/types';
import { TimelineItem } from './TimelineItem';

type TimelineGroup = {
  label: 'standard' | 'legacy' | 'alternative';
  data: IncomeTimeline[];
};

export const IncomeValuesTimeline = ({
  data,
}: {
  data: PensionArrangement;
}) => {
  const { t } = useTranslation();

  const { standardIncome, legacyIncome, alternativeIncome } =
    data.detailData?.incomeAndValues || {};

  const timeLineDataArray: TimelineGroup[] = [
    ...(data.hasMultipleTranches &&
    !data.hasMultipleIncomeOptions &&
    standardIncome
      ? [{ label: 'standard' as const, data: standardIncome }]
      : []),

    ...(data.hasMultipleIncomeOptions && legacyIncome && alternativeIncome
      ? [
          { label: 'legacy' as const, data: legacyIncome },
          { label: 'alternative' as const, data: alternativeIncome },
        ]
      : []),
  ];

  const hasTimeLineData = timeLineDataArray.length > 0;

  const labelText = {
    standard: t('components.income-timeline.standard'),
    legacy: t('components.income-timeline.legacy'),
    alternative: t('components.income-timeline.alternative'),
  };

  if (
    !hasTimeLineData &&
    !data.hasMultipleTranches &&
    !data.hasMultipleIncomeOptions
  ) {
    return null;
  }

  return (
    <div data-testid="income-values-timeline">
      {(data.hasMultipleTranches || data.hasMultipleIncomeOptions) && (
        <Paragraph
          data-testid="income-values-multiplicity"
          className="lg:text-2xl md:mt-6 mb-6 leading-[1.6]"
        >
          {t('components.income-timeline.multiplicity')}
        </Paragraph>
      )}

      {hasTimeLineData && (
        <>
          {data.hasMultipleIncomeOptions && (
            <Markdown
              testId="income-values-mccloud"
              className="lg:text-2xl md:mt-6 mb-6 leading-[1.6]"
              content={t('components.income-timeline.mccloud')}
            />
          )}

          {timeLineDataArray.map((timeLineData) => {
            return (
              <Fragment key={timeLineData.label}>
                {data.hasMultipleIncomeOptions && (
                  <Paragraph
                    data-testid={`income-values-${timeLineData.label}-label`}
                    className="lg:text-2xl md:mt-6 mb-6 leading-[1.6] font-bold"
                  >
                    {labelText[timeLineData.label]}{' '}
                    {t('components.income-timeline.option')}
                  </Paragraph>
                )}

                <ListElement
                  items={timeLineData.data.map((income) => (
                    <TimelineItem
                      key={income.year.toString()}
                      income={income}
                    />
                  ))}
                  variant="ordered"
                  color="blue"
                  className="mb-2 ml-10 text-lg list-disc lg:mb-6 lg:text-2xl"
                  data-testid={`income-values-${timeLineData.label}-list`}
                />
              </Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};
