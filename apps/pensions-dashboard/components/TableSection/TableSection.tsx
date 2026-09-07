import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';

type TableSectionProps = {
  heading: string;
  borderTop?: boolean;
  children?: React.ReactNode;
};

export const TableSection = ({
  heading,
  borderTop = true,
  children,
}: TableSectionProps) => {
  return (
    <div className="mt-14 md:mt-16">
      <Heading
        data-testid="table-section-heading"
        level="h2"
        className="max-md:mb-4 md:text-5xl md:mb-4"
      >
        {heading}
      </Heading>

      <table
        className={twMerge(
          'w-full max-md:leading-6 max-md:block table-fixed',
          borderTop && 'border-t-1 border-t-slate-400',
        )}
        data-testid="table-section-content"
      >
        {children}
      </table>
    </div>
  );
};
