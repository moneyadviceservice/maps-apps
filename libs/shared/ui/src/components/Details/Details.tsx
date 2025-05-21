import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '../Icon';
import { commonLinkClasses } from '../Link';

export type Props = {
  children: ReactNode;
  title: string;
  className?: string;
  testID?: string;
};

export const Details = ({ title, className, testID, children }: Props) => {
  return (
    <details
      className={twMerge('text-sm group', className)}
      data-testid={testID}
    >
      <summary
        className={twMerge(
          '[&::-webkit-details-marker]:hidden [&::marker]:content-none cursor-pointer text-pink-600 underline',
          'w-fit',
          commonLinkClasses,
        )}
      >
        <div className="flex items-center">
          <Icon
            type={IconType.CHEVRON_DOWN}
            className="w-5 mr-2 group-open:rotate-[-180deg]"
          />
          <span>{title}</span>
        </div>
      </summary>
      <div className="py-4">{children}</div>
    </details>
  );
};
