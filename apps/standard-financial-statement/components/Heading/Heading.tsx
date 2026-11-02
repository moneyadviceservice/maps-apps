import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { H2 as HeadingLeveL2 } from '@maps-react/common/components/Heading';

type H2Props = {
  children: ReactNode;
  className?: string;
};

export const H2 = ({ children, className }: H2Props) => (
  <HeadingLeveL2
    className={twMerge(
      'w-full px-6 py-3 bg-slate-200 border-b border-slate-300 font-normal text-md md:text-md',
      className,
    )}
  >
    {children}
  </HeadingLeveL2>
);
