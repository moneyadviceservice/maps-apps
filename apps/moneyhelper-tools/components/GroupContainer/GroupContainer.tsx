import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { GroupType } from 'data/types';
import { ReactNode } from 'react';

type Props = {
  component: GroupType;
  title: string;
  groupKey: string;
  open?: boolean;
  children: ReactNode;
};

export const GroupContainer = ({
  component,
  title,
  groupKey,
  open,
  children,
}: Props) => {
  switch (component) {
    case GroupType.EXPANDABLE:
      return (
        <ExpandableSection
          key={groupKey}
          title={title}
          open={open}
          testId={groupKey}
          variant="mainLeftIcon"
        >
          {children}
        </ExpandableSection>
      );
    case GroupType.HEADING:
      return (
        <>
          <Heading level="h2" className="text-blue-800 mb-8" id={groupKey}>
            {title}
          </Heading>
          {children}
        </>
      );
    default:
      return <>{children}</>;
  }
};
