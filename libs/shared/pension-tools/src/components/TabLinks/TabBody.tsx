import { ReactNode } from 'react';

import { H1 } from '@maps-react/common/components/Heading';

type Props = {
  tab: number;
  heading?: string;
  children: ReactNode;
};

export const TabBody = ({ tab, heading, children }: Props) => {
  return (
    <div role="tabpanel" aria-labelledby={`tab-${tab}`} id={`tabpanel-${tab}`}>
      {heading && <H1 className="mb-8">{heading}</H1>}
      {children}
    </div>
  );
};
