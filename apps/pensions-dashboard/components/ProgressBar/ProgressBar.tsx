import { ReactNode } from 'react';

import { Paragraph } from '@maps-digital/shared/ui';

type Props = {
  amount: number;
  total: number;
  text: string | ReactNode;
  testId?: string;
};

export const ProgressBar = ({
  amount,
  total,
  text,
  testId = 'progress-bar',
}: Props) => {
  const value = Math.max(0, Math.min(amount, total));
  const progress = `${(value / total) * 100}%`;

  return (
    <>
      <Paragraph
        data-testid={testId}
        className="mb-2 text-lg text-gray-800 md:text-2xl"
      >
        {text}
      </Paragraph>
      <div
        aria-hidden="true"
        className="overflow-hidden h-9 md:h-12 bg-blue-700/20"
      >
        <div className="h-full bg-blue-700" style={{ width: progress }} />
      </div>
    </>
  );
};
