import { PropsWithChildren } from 'react';

import { GetServerSideProps } from 'next';

import { AnalyticsWrapper } from 'components/AnalyticsWrapper/AnalyticsWrapper';
import {
  HowRBPWorks,
  LandingHeading,
  RBPInformationCallout,
} from 'components/Landing';
import { BETA_FEEDBACK_LINKS } from 'lib/constants/constants';
import { PAGES_NAMES, PAGES_NAMES_EXTRA } from 'lib/constants/pageConstants';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import querystring from 'querystring';

import { Container } from '@maps-react/core/components/Container';
import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { getServerSideDefaultProps } from './index';

type LandingPageProps = RetirementBudgetPlannerPageProps & NavigationDataProps;

const Landing = ({ isEmbedded = false, query }: LandingPageProps) => {
  const { locale, t } = useTranslation();
  const pageTitle = t('landingPage.heading', undefined, '');

  // Remove any query parameters we don't want to pass to the next page
  const filteredQuery = { ...query };
  delete filteredQuery.navType;
  delete filteredQuery.language;

  const filteredQueryString =
    Object.entries(filteredQuery).length > 0
      ? `?${querystring.stringify(filteredQuery)}`
      : '';

  return (
    <AnalyticsWrapper tabName={PAGES_NAMES_EXTRA.LANDING}>
      <LandingPageLayout isEmbedded={isEmbedded} pageTitle={pageTitle}>
        <Container className="space-y-12">
          <LandingHeading
            nextPageLink={`/${locale}/${PAGES_NAMES.ABOUTYOU}${filteredQueryString}`}
            isEmbedded={isEmbedded}
          />
          <HowRBPWorks lang={locale} />
          <RBPInformationCallout />
        </Container>
      </LandingPageLayout>
    </AnalyticsWrapper>
  );
};

const LandingPageLayout = ({
  isEmbedded,
  children,
  pageTitle,
}: PropsWithChildren<{ isEmbedded: boolean; pageTitle: string }>) => {
  const { locale } = useTranslation();

  return isEmbedded ? (
    <EmbedPageLayout title={pageTitle}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      pageTitle={pageTitle}
      phase={PhaseType.BETA}
      phaseFeedbackLink={
        locale === 'cy' ? BETA_FEEDBACK_LINKS.cy : BETA_FEEDBACK_LINKS.en
      }
    >
      {children}
    </ToolPageLayout>
  );
};

export default Landing;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSideDefaultProps(context);
};
