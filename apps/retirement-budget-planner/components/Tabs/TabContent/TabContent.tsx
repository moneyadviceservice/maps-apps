import { ReactNode } from 'react';

import { VisibleSection } from 'components/VisibleSection';
import { PAGES_NAMES } from 'lib/constants/pageConstants';

import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type Props = {
  children: ReactNode;
  title: string;
  tabName: string;
  description?: ReactNode;
};

const TabContent = ({ children, title, tabName, description }: Props) => (
  <>
    <H1 className="py-8 text-blue-800" data-testid="title">
      {title}
    </H1>
    {description && <Paragraph>{description}</Paragraph>}
    <div className="flex flex-row gap-4">
      <div className="basis-9/12">{children}</div>
      <VisibleSection visible={tabName !== PAGES_NAMES.SUMMARY}>
        <div data-testid="summary-total">Summary total component</div>
      </VisibleSection>
    </div>
  </>
);

export default TabContent;
