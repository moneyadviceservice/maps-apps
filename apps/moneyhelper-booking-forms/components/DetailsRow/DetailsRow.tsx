import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link/Link';
import { Language } from '@maps-react/mhf/utils';

type DetailsRow = {
  label: string;
  value: ReactNode;
  changehref?: string;
  changeLabel?: string;
  locale?: Language;
  className?: string;
  labelClassName?: string;
};

export const DetailsRow = ({
  label,
  value,
  changehref,
  changeLabel,
  locale,
  className,
  labelClassName,
}: DetailsRow) => {
  const hasAction = Boolean(changehref && changeLabel);
  return (
    <dl className={twMerge('border-b last:border-b-0', className)}>
      <div className="grid gap-2 md:py-2 md:grid-cols-12 md:items-start md:gap-0">
        <dt className={twMerge('md:col-span-5', labelClassName)}>{label}</dt>
        <dd className={hasAction ? 'md:col-span-5' : 'md:col-span-7'}>
          {value}
        </dd>
        {hasAction && (
          <dd className="md:col-span-2 md:text-right md:pr-6">
            <Link
              href={`/${locale}/${changehref}?edit=true`}
              className="underline text-magenta-500 hover:text-pink-800"
            >
              {changeLabel}
            </Link>
          </dd>
        )}
      </div>
    </dl>
  );
};
