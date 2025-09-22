import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

export enum BACKGROUND_COLOUR {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
}

type Props = {
  children: ReactNode;
  theme: BACKGROUND_COLOUR;
};

export const Theme = ({ children, theme }: Props) => (
  <div
    className={twMerge(
      theme === BACKGROUND_COLOUR.GREEN && 'bg-green-200',
      theme === BACKGROUND_COLOUR.YELLOW && 'bg-yellow-180',
      'p-1.5',
      'md:p-8',
      'rounded-bl-3xl',
    )}
  >
    {children}
  </div>
);
