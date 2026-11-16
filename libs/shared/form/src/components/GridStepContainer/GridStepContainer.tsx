import { GridContainer } from '@maps-react/core/components/GridContainer';

import { Props, StepContent } from '../StepContainer/StepContainer';

export type Layout = 'grid' | 'default';

export const GridStepContainer = ({ children, ...props }: Props) => (
  <GridContainer>
    <div className="col-span-12 lg:col-span-10 xl:col-span-8">
      <StepContent {...props}>{children}</StepContent>
    </div>
  </GridContainer>
);
