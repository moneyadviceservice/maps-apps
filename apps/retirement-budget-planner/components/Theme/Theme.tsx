import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

export enum BACKGROUND_COLOUR {
  DEFAULT = '',
  GREY = 'grey',
}

type Props = {
  children: ReactNode;
  theme?: BACKGROUND_COLOUR;
};

export const Theme = ({ children, theme }: Props) => (
  <div
    className={twMerge(
      'p-1.5',
      'md:p-0',
      'rounded-bl-3xl',
      theme === BACKGROUND_COLOUR.GREY && 'bg-slate-200 md:p-3',
    )}
  >
    {children}
  </div>
);
