import { ReactNode } from 'react';

import { Container as DefaultContainer } from '@maps-react/core/components/Container';
import {
  GridStepContainer,
  Layout,
} from '@maps-react/form/components/GridStepContainer/GridStepContainer';

type Props = {
  children: ReactNode;
  layout?: Layout;
};

export const TabContainer = ({ children, layout }: Props) => {
  const Container = layout === 'grid' ? GridStepContainer : DefaultContainer;

  return (
    <Container>
      <div
        className={`${layout === 'grid' ? '' : 'max-w-[980px]'}`}
        data-testid="tab-container-div"
      >
        {children}
      </div>
    </Container>
  );
};
