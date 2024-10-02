import { Container } from '@maps-react/core/components/Container';
import { ReactNode } from 'react';

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
