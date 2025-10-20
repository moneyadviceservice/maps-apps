import React from 'react';

import { twMerge } from 'tailwind-merge';

import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { DefinitionDescription } from './DefinitionDescription';
import { DefinitionTerm } from './DefinitionTerm';

export type DefinitionItem = {
  title: string | React.ReactNode;
  value: string | React.ReactNode;
  testId?: string;
};

interface DefinitionListItemProps {
  className?: string;
  dlClassName?: string;
  testId?: string;
  title?: string | React.ReactNode;
  subText?: string | React.ReactNode;
  items: DefinitionItem[];
}

export const DefinitionList = ({
  className,
  dlClassName,
  testId = 'definition-list',
  items,
  title,
  subText,
}: DefinitionListItemProps) => {
  return (
    <div
      className={twMerge(
        'p-4 pb-9 bg-slate-300 rounded-bl-[24px] mb-9 lg:p-14 lg:pt-13 lg:rounded-bl-[40px] xl:w-10/12 2xl:w-9/12',
        className,
      )}
    >
      {title && (
        <H2
          data-testid={testId + '-title'}
          className="mb-7 md:text-5xl md:mb-10"
        >
          {title}
        </H2>
      )}
      {subText && (
        <Paragraph
          data-testid={testId + '-sub-text'}
          className="mb-12 xl:pr-24"
        >
          {subText}
        </Paragraph>
      )}
      <dl
        data-testid={testId}
        className={twMerge('md:grid md:grid-cols-[42%_58%]', dlClassName)}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <DefinitionTerm testId={item.testId}>{item.title}</DefinitionTerm>
            <DefinitionDescription testId={item.testId}>
              {item.value}
            </DefinitionDescription>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};
