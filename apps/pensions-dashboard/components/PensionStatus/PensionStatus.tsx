import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionStatus as Status } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type PensionStatusProps = {
  data: PensionArrangement;
  showShortText?: boolean;
};

export const PensionStatus = ({ data, showShortText }: PensionStatusProps) => {
  const { t } = useTranslation();

  if (!data.pensionStatus) return null;

  const active = data.pensionStatus === Status.A;

  const shortTextMessage = active
    ? t('data.pensions.status.active')
    : t('data.pensions.status.inactive');

  const detailedMessage = active
    ? t('pages.pension-details.status.active')
    : t('pages.pension-details.status.inactive');

  const message = showShortText ? shortTextMessage : detailedMessage;

  const icon = (
    <div
      className={twMerge(
        'rounded-full',
        active ? 'bg-green-700' : 'bg-gray-400',
        showShortText ? 'w-[12px] h-[12px]' : 'min-w-4 min-h-4',
      )}
    />
  );

  return (
    <div
      className={twMerge('flex items-baseline gap-4', !showShortText && 'mb-4')}
    >
      {icon}
      {message}
    </div>
  );
};
