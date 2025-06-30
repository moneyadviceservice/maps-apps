import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const ScamWarning = ({ title, children, className }: Props) => {
  return (
    <InformationCallout
      variant="withDominantBorder"
      className={twMerge('px-6 py-8 mt-6 md:mt-8 md:px-12', className)}
    >
      <Heading level="h3" className="mb-4 md:text-4xl">
        {title}
      </Heading>
      {children}
    </InformationCallout>
  );
};
