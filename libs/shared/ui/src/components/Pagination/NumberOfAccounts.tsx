import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type NumberOfAccountsProps = {
  classes: string;
  startIndex: number;
  endIndex: number;
  totalItems: number;
};

export const NumberOfAccounts = ({
  classes,
  startIndex,
  endIndex,
  totalItems,
}: NumberOfAccountsProps) => {
  const { z } = useTranslation();
  return (
    <div className={twMerge(classes)}>
      {totalItems > 0 &&
        z(
          {
            en: '{a} - {b} of {c}',
            cy: '{a} - {b} o {c}',
          },
          {
            a: String(startIndex + 1),
            b: String(Math.min(endIndex, totalItems)),
            c: String(totalItems),
          },
        )}
    </div>
  );
};
