import { ReactNode } from 'react';

import { Container } from '@maps-react/core/components/Container';

type Props = {
  children: ReactNode;
};

export const TabContainer = ({ children }: Props) => (
  <Container>
    <div className="max-w-[980px]" data-testid="tab-container-div">
      {children}
    </div>
  </Container>
);
