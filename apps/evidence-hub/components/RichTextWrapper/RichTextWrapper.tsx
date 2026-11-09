import React from 'react';

import { twMerge } from 'tailwind-merge';

import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';

export const classNamesRichTextWrapper = ['pb-2'];

interface RichTextWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export const RichTextWrapper: React.FC<RichTextWrapperProps> = ({
  className,
  children,
}) => {
  return (
    <RichTextAem className={twMerge(classNamesRichTextWrapper, className)}>
      {children}
    </RichTextAem>
  );
};

export default RichTextWrapper;
