import React, { MouseEventHandler } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export const PrintStatementButton = ({ onClick, className }: Props) => {
  return (
    <Button
      data-testid="print-statement-button"
      type="button"
      variant="link"
      className={twMerge(
        'flex flex-row w-full justify-center gap-0 px-4 text-sm font-semibold text-blue-600 no-underline lg:text-base lg:inline-flex lg:justify-start lg:w-auto lg:underline',
        className,
      )}
      onClick={onClick}
    >
      Print statement
    </Button>
  );
};
