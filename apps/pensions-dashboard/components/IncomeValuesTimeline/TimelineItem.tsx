import { Paragraph } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { IncomeTimeline } from '../../lib/types';
import { currencyAmount } from '../../lib/utils/ui';

export const TimelineItem = ({ income }: { income: IncomeTimeline }) => {
  const { t } = useTranslation();
  const isIncrease = (income?.difference ?? 0) > 0;

  return (
    <Paragraph data-testid={`income-item-${income.year}`}>
      <Markdown
        testId="income-monthly"
        disableParagraphs
        content={t('components.income-timeline.monthlyText', {
          date: income.year.toString(),
          income: currencyAmount(income.monthlyAmount),
        })}
      />
      {income?.difference && income?.difference !== 0 && (
        <span
          data-testid="income-difference"
          className={isIncrease ? 'text-green-700' : 'text-red-700'}
        >
          {' '}
          (
          {isIncrease
            ? t('components.income-timeline.increase')
            : t('components.income-timeline.decrease')}{' '}
          {currencyAmount(Math.abs(income.difference))})
        </span>
      )}
      {income.lumpSumAmount > 0 && (
        <>
          {' '}
          <Markdown
            testId="income-lump-sum"
            disableParagraphs
            content={t('components.income-timeline.lumpSumText', {
              income: currencyAmount(income.lumpSumAmount),
            })}
          />
        </>
      )}
      .
    </Paragraph>
  );
};
