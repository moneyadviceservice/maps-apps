import React from 'react';

export type ProgressIndicatorProps = {
  srOnlyText: string;
  sectionText: string;
  stepText: string;
};

export const ProgressIndicator = ({
  srOnlyText,
  sectionText,
  stepText,
}: ProgressIndicatorProps) => {
  return (
    <p
      data-testid="progress-indicator"
      className="mb-1 text-sm font-semibold text-gray-650 leading-[normal] lg:hidden"
    >
      <span className="sr-only">{srOnlyText}</span>
      <span>{stepText}</span> — <span>{sectionText}</span>
    </p>
  );
};
