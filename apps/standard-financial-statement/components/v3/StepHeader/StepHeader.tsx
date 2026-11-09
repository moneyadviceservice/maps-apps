import React from 'react';

import { H1 } from '@maps-react/common/index';

import {
  ProgressIndicator,
  type ProgressIndicatorProps,
} from '../ProgressIndicator/ProgressIndicator';

type Props = {
  mobileText: string;
  desktopText: string;
  progressIndicatorProps: ProgressIndicatorProps;
};

export const StepHeader = ({
  mobileText,
  desktopText,
  progressIndicatorProps,
}: Props) => {
  return (
    <header data-testid="step-header">
      <ProgressIndicator {...progressIndicatorProps} />
      <H1 className="mb-1 w-full text-[2rem] leading-[normal] text-left md:text-[2rem] lg:text-[3rem] lg:mb-3">
        <span className="block lg:hidden">{mobileText}</span>
        <span className="hidden lg:block">{desktopText}</span>
      </H1>
    </header>
  );
};
