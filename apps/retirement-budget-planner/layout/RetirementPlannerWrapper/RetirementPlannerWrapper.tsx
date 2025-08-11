import { ReactNode } from 'react';

import { VisibleSection } from 'components/VisibleSection';

import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
  children: ReactNode;
  isEmbedded: boolean;
  pageTitle: string;
  title: string;
};

export const RetirementPlannerWrapper = ({
  children,
  isEmbedded,
  pageTitle,
  title,
}: Props) => {
  return (
    <>
      <VisibleSection visible={isEmbedded}>
        <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
      </VisibleSection>
      <VisibleSection visible={!isEmbedded}>
        <ToolPageLayout pageTitle={pageTitle}>{children}</ToolPageLayout>
      </VisibleSection>
    </>
  );
};

export default RetirementPlannerWrapper;
