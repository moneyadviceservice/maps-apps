import React from 'react';

interface PensionCardRowProps {
  term: string;
  description: React.ReactNode;
  testId?: string;
}

export const PensionCardRow = ({
  term,
  description,
  testId,
}: PensionCardRowProps) => {
  return (
    <>
      <dt className="mb-0 font-normal text-gray-650">{term}</dt>
      <dd
        className="pb-2 mb-2 break-words border-b-1 border-slate-400"
        data-testid={testId}
      >
        {description}
      </dd>
    </>
  );
};
