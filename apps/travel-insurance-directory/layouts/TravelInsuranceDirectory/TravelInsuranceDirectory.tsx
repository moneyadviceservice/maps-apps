import { ReactNode } from 'react';

import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';

import {
  AnalyticsTrigger,
  TrackEvents,
} from 'components/Analytics/AnalyticsTrigger';
import { TravelInsuranceDirectoryPageLayout } from 'layouts/TravelInsuranceDirectoryPageLayout';
import { REGISTER_ANALYTICS_TRACKING_DEFAULTS } from 'lib/analytics/pageAnalytics';
import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Container } from '@maps-react/core/components/Container';
import { AnalyticsData } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const backLinkElement = (router: NextRouter, backLink?: string) => {
  if (backLink) {
    return <BackLink href={backLink}>Back</BackLink>;
  }

  return (
    <div className="flex items-center text-magenta-500 group">
      <Icon
        type={IconType.CHEVRON_LEFT}
        className="text-magenta-500 group-hover:text-pink-800 w-[8px] h-[15px]"
        aria-hidden="true"
      />
      <Button
        variant="link"
        className="underline tool-nav-prev group-hover:cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
      >
        Back
      </Button>
    </div>
  );
};

export type AnalyticsConfig = {
  trackEvents?: TrackEvents;
  lastStep?: string;
};

type Props = {
  browserTitle: string;
  backLink?: string;
  displayBacklink?: boolean;
  heading?: string | null;
  showLanguageSwitcher?: boolean;
  topInfoSection?: ReactNode;
  errorSummarySection?: ReactNode;
  analyticsData?: AnalyticsData;
  analyticsConfig?: AnalyticsConfig;
  trackDefaults?: typeof REGISTER_ANALYTICS_TRACKING_DEFAULTS;
  currentFlow?: 'user' | 'firm' | 'scenario' | 'save';
  children: ReactNode;
};

export const TravelInsuranceDirectory = ({
  browserTitle,
  backLink,
  displayBacklink = true,
  heading,
  showLanguageSwitcher = true,
  topInfoSection,
  errorSummarySection,
  analyticsData = {},
  analyticsConfig,
  currentFlow,
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const router = useRouter();
  const title = appTitle(z);

  return (
    <AnalyticsTrigger
      analyticsData={analyticsData}
      currentStep={analyticsData.tool?.toolStep ?? '0'}
      currentFlow={currentFlow}
      lastStep={analyticsConfig?.lastStep}
      trackEvents={analyticsConfig?.trackEvents}
      error={[]}
    >
      <TravelInsuranceDirectoryPageLayout
        pageTitle={pageTitle(browserTitle, z)}
        title={title}
        titleTag={'span'}
        noMargin={true}
        mainClassName="my-8 text-gray-800"
        className="pt-8 mb-4"
        showLanguageSwitcher={showLanguageSwitcher}
        topInfoSection={topInfoSection}
      >
        <Container>
          <div className="lg:max-w-[980px] space-y-8">
            {displayBacklink && backLinkElement(router, backLink)}

            {errorSummarySection}
            {heading && <Heading level="h1">{heading}</Heading>}
            {children}
          </div>
        </Container>
      </TravelInsuranceDirectoryPageLayout>
    </AnalyticsTrigger>
  );
};

export default TravelInsuranceDirectory;
