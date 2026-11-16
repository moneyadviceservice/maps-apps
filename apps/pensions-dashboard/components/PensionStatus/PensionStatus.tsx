import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionStatus as Status } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { tooltipScreenReaderText } from '../../lib/utils/ui';
import { pensionDetailCalloutClasses } from '../PensionDetailCallout';

type PensionStatusProps = {
  data: PensionArrangement;
  className?: string;
  detailStatus?: boolean;
};

export const PensionStatus = ({
  data,
  className,
  detailStatus = false,
}: PensionStatusProps) => {
  const { t } = useTranslation();

  if (!data.pensionStatus) return null;

  const active = data.pensionStatus === Status.A;

  const message = active ? t('data/status.active') : t('data/status.inactive');

  const icon = (
    <div
      className={twMerge(
        'rounded-full w-[12px] h-[12px]',
        active ? 'bg-green-700' : 'bg-gray-650',
        detailStatus && 'w-[18px] h-[18px]',
      )}
      data-testid="pension-status-icon"
    />
  );

  return (
    <div
      data-testid="pension-status"
      className={twMerge(
        'flex items-baseline gap-4',
        detailStatus &&
          `gap-7 px-5 items-center ${pensionDetailCalloutClasses}`,
        className,
      )}
    >
      {icon}
      <span className={detailStatus ? 'flex items-center' : ''}>
        {message}
        {detailStatus && (
          <Markdown
            className="ml-5"
            disableParagraphs
            content={t(`tooltips.status-${active ? 'active' : 'inactive'}`)}
            tooltipProps={{
              accessibilityLabelOpen: tooltipScreenReaderText(
                t(`tooltips.sr-text.status-${active ? 'active' : 'inactive'}`),
                t,
              ),
            }}
          />
        )}
      </span>
    </div>
  );
};
