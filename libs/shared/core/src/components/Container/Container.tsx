import { HTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

export type ContainerProps = HTMLAttributes<HTMLElement>;

export const Container = ({
  className,
  children,
  ...props
}: ContainerProps) => {
  return (
    <div className={twMerge('container-auto', className)} {...props}>
      {children}
    </div>
  );
};
