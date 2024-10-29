import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type Props = {
  children: ReactNode;
  testClass?: string;
  testId?: string;
  variant?: 'default' | 'withShadow';
  className?: string;
};

const informationCalloutShadow = {
  withShadow: 'shadow-1md',
};

export const InformationCallout = ({
  children,
  testClass = 't-information-callout',
  testId = 'information-callout',
  variant = 'default',
  className,
  ...rest
}: Props) => {
  return (
    <div
      className={twMerge(
        testClass,
        'border',
        'border-slate-400',
        'rounded-bl-3xl',
        variant !== 'default' && informationCalloutShadow[variant],
        className,
      )}
      data-testid={testId}
      {...rest}
    >
      {children}
    </div>
  );
};
