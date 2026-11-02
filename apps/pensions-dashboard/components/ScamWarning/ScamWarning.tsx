import { twMerge } from 'tailwind-merge';

import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const ScamWarning = ({ title, children, className }: Props) => {
  return (
    <Callout
      variant="arrow"
      border="teal"
      className={twMerge('px-6 py-8 md:px-10', className)}
    >
      <Heading
        level="h3"
        className="mb-4 md:mb-6 text-xl font-semibold md:!leading-8 md:text-4xl"
      >
        {title}
      </Heading>
      {children}
    </Callout>
  );
};
