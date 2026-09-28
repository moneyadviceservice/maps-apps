import { HTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

export type GridContainerProps = HTMLAttributes<HTMLElement>;

export const GridContainer = ({
  className,
  children,
  ...props
}: GridContainerProps) => {
  return (
    <div
      className={twMerge(
        'max-w-[1272px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-12 gap-x-4 md:gap-x-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
