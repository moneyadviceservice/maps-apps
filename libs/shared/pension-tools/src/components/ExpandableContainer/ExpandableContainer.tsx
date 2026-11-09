import { ReactNode } from 'react';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';

export interface ExpandableContainerProps {
  heading: string;
  items: {
    title: string;
    text: string | ReactNode;
  }[];
}

export const ExpandableContainer = ({
  heading,
  items,
}: ExpandableContainerProps) => (
  <>
    <Heading level="h1" component="h2" className="my-6">
      {heading}
    </Heading>

    {items.map(({ title, text }, index) => (
      <div key={`${title.replace(' ', '-')}${index}`}>
        <ExpandableSection
          testClassName=""
          variant="mainLeftIcon"
          title={title}
        >
          <div className="mb-8">{text}</div>
        </ExpandableSection>
      </div>
    ))}
  </>
);
