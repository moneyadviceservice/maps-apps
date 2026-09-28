import type { ComponentProps, PropsWithChildren } from 'react';

import { AnalyticsWrapper } from 'components/AnalyticsWrapper/AnalyticsWrapper';
import { VisibleSection } from 'components/VisibleSection';
import { BETA_FEEDBACK_LINKS } from 'lib/constants/constants';
import { PAGES_NAMES, PAGES_NAMES_EXTRA } from 'lib/constants/pageConstants';

import { Analytics } from '@maps-react/core/components/Analytics';
import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = PropsWithChildren<{
  isEmbedded: boolean;
  pageTitle: string;
  title: string;
  tabName: PAGES_NAMES | PAGES_NAMES_EXTRA;
  analyticsErrors?: ComponentProps<typeof Analytics>['errors'];
}>;

export const RetirementPlannerWrapper = ({
  children,
  isEmbedded,
  pageTitle,
  title,
  tabName,
  analyticsErrors,
}: Props) => {
  const { locale } = useTranslation();

  return (
    <AnalyticsWrapper tabName={tabName} errors={analyticsErrors}>
      <VisibleSection visible={isEmbedded}>
        <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
      </VisibleSection>

      <VisibleSection visible={!isEmbedded}>
        <ToolPageLayout
          pageTitle={pageTitle}
          title={title}
          headingLevel="h4"
          noMargin={true}
          phase={PhaseType.BETA}
          phaseFeedbackLink={
            locale === 'cy' ? BETA_FEEDBACK_LINKS.cy : BETA_FEEDBACK_LINKS.en
          }
        >
          {children}
        </ToolPageLayout>
      </VisibleSection>
    </AnalyticsWrapper>
  );
};

export default RetirementPlannerWrapper;
