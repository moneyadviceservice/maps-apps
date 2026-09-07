import { useEffect } from 'react';

import FuelFinder from 'components/FuelFinder/FuelFinder';

import { BackLink } from '@maps-react/common/components/BackLink';
import { EmergencyBanner } from '@maps-react/core/components/EmergencyBanner';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import {
  analyticsPageTitle as getAnalyticsPageTitle,
  pageTitle as getPageTitle,
} from '../../data/fuel-finder';
import type { FuelFinderPageProps } from '../../utils/FuelFinder/fuelFinderGetServerSideProps';
export { default as getServerSideProps } from '../../utils/FuelFinder/fuelFinderGetServerSideProps';

const FuelFinderResultsPage = ({
  stations,
  totalItems,
  fetchedAt,
  hasSearched,
  isEmbed,
  emergencyBannerContent,
}: FuelFinderPageProps) => {
  const { z, locale } = useTranslation();
  const { addEvent } = useAnalytics();

  const title = getPageTitle(z);
  const analyticsPageTitle = getAnalyticsPageTitle(z);

  useEffect(() => {
    addEvent({
      event: 'pageLoadReact',
      page: {
        pageName: 'petrol-price-finder',
        pageTitle: analyticsPageTitle,
        lang: locale,
        categoryLevels: ['Everyday money'],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: isEmbed ? 'embedded' : 'direct',
      },
      tool: {
        toolName: 'Petrol price finder',
        toolCategory: '',
        toolStep: '2',
        stepName: 'Petrol price finder Results',
      },
    });
  });

  const children = (
    <>
      <GridContainer>
        <div className="mb-8">
          <BackLink href={`/${locale}`}>
            {z({ en: 'Back', cy: 'Yn \u00f4l' })}
          </BackLink>
        </div>
      </GridContainer>

      <FuelFinder
        stations={stations}
        totalItems={totalItems}
        fetchedAt={fetchedAt}
        hasSearched={hasSearched}
      />
    </>
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      noMargin={true}
      titleTag="span"
      layout="grid"
      mainClassName="my-8"
      phase={PhaseType.BETA}
      phaseFeedbackLink={z({
        en: 'https://forms.office.com/Pages/ResponsePage.aspx?id=MhDku86PQk26tUTiFRCIbWGb15XS-wVNqpSc16_QSvhUN09UQUI4SVhITDhCV0RRSzcyMlIwUTI4Ny4u',
        cy: 'https://forms.office.com/Pages/ResponsePage.aspx?id=MhDku86PQk26tUTiFRCIbWGb15XS-wVNqpSc16_QSvhUN09UQUI4SVhITDhCV0RRSzcyMlIwUTI4Ny4u',
      })}
      phaseBannerClassName="text-sm text-black"
      topInfoSection={
        emergencyBannerContent && (
          <EmergencyBanner content={emergencyBannerContent} />
        )
      }
    >
      {children}
    </ToolPageLayout>
  );
};

export default FuelFinderResultsPage;
