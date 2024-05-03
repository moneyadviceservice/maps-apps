import { ReactNode } from 'react';

export type Props = {
  children: ReactNode;
  gridCols?: number;
};

export const TeaserCardContainer = ({ children, gridCols = 3 }: Props) => {
  return (
    <div className={`space-y-5`}>
      <div className={`md:grid-cols-${gridCols} grid grid-cols-1 gap-8`}>
        {children}
      </div>
    </div>
  );
};
