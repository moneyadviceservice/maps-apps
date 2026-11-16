import { ReactNode } from 'react';

import { useFocusOnMount } from 'hooks/useFocusOnMount';

interface ResultsCalloutWrapperProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export const ResultsCalloutWrapper = ({
  id,
  className = '',
  children,
}: ResultsCalloutWrapperProps) => {
  const ref = useFocusOnMount<HTMLDivElement>();

  return (
    <div
      id={id}
      data-testid={id}
      ref={ref}
      tabIndex={-1}
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8 focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
};
