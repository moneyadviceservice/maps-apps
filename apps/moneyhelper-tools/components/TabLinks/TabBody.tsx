import { H1 } from '@maps-react/common/components/Heading';
import { ReactNode } from 'react';

type Props = {
  heading?: string;
  children: ReactNode;
};

export const TabBody = ({ heading, children }: Props) => {
  return (
    <div>
      {heading && <H1 className="mb-8 md:text-[48px]">{heading}</H1>}
      {children}
    </div>
  );
};
