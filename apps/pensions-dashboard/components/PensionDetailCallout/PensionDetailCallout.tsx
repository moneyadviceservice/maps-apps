import { twMerge } from 'tailwind-merge';

type PensionDetailCalloutProps = {
  children: React.ReactNode;
  className?: string;
  testId?: string;
};

export const pensionDetailCalloutClasses =
  'border-2 border-slate-400 rounded-bl-2xl text-lg md:text-xl font-bold mb-6 py-3';

export const PensionDetailCallout = ({
  children,
  className,
  testId = 'pension-detail-callout',
}: PensionDetailCalloutProps) => {
  return (
    <div
      data-testid={testId}
      className={twMerge(pensionDetailCalloutClasses, className)}
    >
      {children}
    </div>
  );
};
