import { ReactNode } from 'react';

import { VisibleSection } from 'components/VisibleSection';
import { PAGES_NAMES } from 'lib/constants/pageConstants';

import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type Props = {
  children: ReactNode;
  title: string;
  tabName: PAGES_NAMES;
  description?: ReactNode;
};

const TabContent = ({ children, title, tabName, description }: Props) => {
  const makeSummaryTotalVisible =
    tabName !== PAGES_NAMES.ABOUTYOU && tabName !== PAGES_NAMES.SUMMARY;
  return (
    <>
      <H1 className="py-8 text-blue-800" data-testid="title">
        {title}
      </H1>
      {description && <Paragraph>{description}</Paragraph>}
      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="basis-8/12 space-y-14">{children}</div>
        <VisibleSection visible={makeSummaryTotalVisible}>
          <div data-testid="summary-total">Summary total component</div>
        </VisibleSection>
      </div>
    </>
  );
};

export default TabContent;
