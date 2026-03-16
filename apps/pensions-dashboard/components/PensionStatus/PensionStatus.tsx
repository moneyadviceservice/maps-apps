import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionStatus as Status } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
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

  const message = active
    ? t('data.pensions.status.active')
    : t('data.pensions.status.inactive');

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
            className="ml-5 font-normal"
            disableParagraphs
            content={t(`tooltips.status-${active ? 'active' : 'inactive'}`)}
          />
        )}
      </span>
    </div>
  );
};
