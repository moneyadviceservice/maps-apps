import { ReactNode } from 'react';

import { H1 } from '@maps-react/common/components/Heading';

type Props = {
  tab: number;
  heading?: string;
  headingClassName?: string;
  children: ReactNode;
};

export const TabBody = ({
  tab,
  heading,
  headingClassName = 'mb-8',
  children,
}: Props) => {
  return (
    <div role="tabpanel" aria-labelledby={`tab-${tab}`} id={`tabpanel-${tab}`}>
      {heading && <H1 className={headingClassName}>{heading}</H1>}
      {children}
    </div>
  );
};
