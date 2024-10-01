import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type Props = {
  children: ReactNode;
  gridCols?: number;
};

export const TeaserCardContainer = ({ children, gridCols = 3 }: Props) => {
  const gridColsClass: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    7: 'md:grid-cols-7',
    8: 'md:grid-cols-8',
    9: 'md:grid-cols-9',
    10: 'md:grid-cols-10',
    11: 'md:grid-cols-11',
    12: 'md:grid-cols-12',
  };
  return (
    <div className={`space-y-5`}>
      <div
        className={twMerge(gridColsClass[gridCols], `grid grid-cols-1 gap-8`)}
      >
        {children}
      </div>
    </div>
  );
};
