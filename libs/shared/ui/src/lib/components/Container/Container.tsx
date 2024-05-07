import { HTMLAttributes } from 'react';
import classNames from 'classnames';

export type ContainerProps = HTMLAttributes<HTMLElement>;

export const Container = ({
  className,
  children,
  ...props
}: ContainerProps) => {
  return (
    <div className={classNames('container-auto', className)} {...props}>
      {children}
    </div>
  );
};
