import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Icon } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { currencyAmount } from '../../lib/utils/ui';
import { TimelineIcon, TimelineIconColor } from '../TimelineKey';

type TimelineEntryProps = {
  arrangement: Pension;
  year: string;
};

export type Pension = {
  id: string;
  schemeName: string;
  pensionType: string;
  payableDate: string;
  lastPayableDate?: string | null;
  monthlyAmount?: number;
  annualAmount?: number;
  lumpSumAmount?: number;
  lumpSumPayableDate?: string;
};

export const TimelineEntry = ({ arrangement, year }: TimelineEntryProps) => {
  const {
    id,
    lumpSumAmount,
    lumpSumPayableDate,
    monthlyAmount,
    pensionType,
    schemeName,
  } = arrangement;

  const showLumpSum =
    lumpSumAmount &&
    lumpSumPayableDate &&
    !Number.isNaN(new Date(lumpSumPayableDate).getTime()) &&
    new Date(lumpSumPayableDate).getFullYear() === Number(year);

  const { t, locale } = useTranslation();

  return (
    <li data-testid="timeline-entry" className={twMerge('mb-8 last:mb-0')}>
      <div className="flex items-start">
        <Icon
          type={TimelineIcon[pensionType]}
          className={`inline-block mt-[1px] w-[24px] h-[24px] shrink-0 ${TimelineIconColor[pensionType]}`}
        />
        <div className="pl-2">
          {pensionType !== PensionType.SP && (
            <span data-testid="timeline-entry-type" className="sr-only">
              {t(`pages.your-pensions-timeline.key.items.${pensionType}`)}
            </span>
          )}
          <p className="font-bold lg:mb-1">{schemeName}</p>
          {monthlyAmount && (
            <p data-testid="timeline-estimated-income" className="lg:mb-1">
              {t('common.estimated-income')}:{' '}
              <strong>
                {currencyAmount(monthlyAmount)} {t('common.a-month')}
              </strong>
            </p>
          )}
          {showLumpSum ? (
            <p data-testid="timeline-lump-sum" className="lg:mb-1">
              <Icon
                type={TimelineIcon['LU']}
                className={`inline-block mt-[-2px] w-[24px] h-[24px] mr-2 ${TimelineIconColor['LU']}`}
              />
              {t('common.lump-sum')}:{' '}
              <strong>{currencyAmount(lumpSumAmount)}</strong>
            </p>
          ) : null}
          <form method="POST">
            <input type="hidden" name="pensionId" value={id} />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="pensionType" value={pensionType} />
            <Button
              formAction="/api/set-pension-id"
              data-testid="details-link"
              variant="link"
              className="inline-block max-lg:mt-1"
            >
              {t('common.details-link')}
            </Button>
          </form>
        </div>
      </div>
    </li>
  );
};
