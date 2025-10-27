import { GetServerSideProps } from 'next';

import { EmergencyBanner } from '@maps-react/core/components/EmergencyBanner';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import {
  constructURL,
  getAppConfig,
  getConfigValue,
} from '@maps-react/netlify-functions/utils/getAppConfig';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

import { LandTransactionTaxCalculator } from '../../components/LandTransactionTaxCalculator';
import { landTransactionTaxConfig } from '../../data/ltt/landTransactionTaxConfig';

type Props = {
  price: string;
  buyerType: 'firstOrNextHome' | 'additionalHome';
  calculated: boolean;
  isEmbed: boolean;
  content?: string;
  day?: string;
  month?: string;
  year?: string;
};

const Page = ({
  price,
  buyerType,
  calculated,
  isEmbed,
  content,
  day,
  month,
  year,
}: Props) => {
  const { z } = useTranslation();
  const emergencyBannerContent = parseEmergencyBanner(content);
  const { addPage } = useAnalytics();

  const toolHref = landTransactionTaxConfig.pagePath;

  const title = z({
    en: 'Land Transaction Tax Calculator',
    cy: 'Cyfrifiannell Treth Trafodiadau Tir',
  });

  const error = !price || !buyerType;

  let pageTitle;
  if (calculated && error) {
    pageTitle = z({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    });
  } else if (calculated) {
    pageTitle = z({
      en: 'Land Transaction Tax Calculator Results',
      cy: 'Canlyniadau Cyfrifiannell Treth Trafodiadau Tir',
    });
  } else {
    pageTitle = z({
      en: 'Land Transaction Tax Calculator',
      cy: 'Cyfrifiannell Treth Trafodiadau Tir',
    });
  }

  const initialPageData = {
    page: {
      pageName: `ltt-calculator${calculated ? ' results' : ''}`,
      pageTitle: pageTitle,
    },
    tool: {
      toolName: 'ltt_calculator',
      toolStep: calculated ? '2' : '1',
      stepName: calculated ? 'results' : 'details',
      pagePath: toolHref,
    },
  };

  addPage([{ ...initialPageData, event: 'pageLoadReact' }]);

  const children = (
    <LandTransactionTaxCalculator
      propertyPrice={price}
      buyerType={buyerType}
      calculated={calculated}
      analyticsData={initialPageData}
      isEmbedded={isEmbed}
      day={day}
      month={month}
      year={year}
    />
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      headingClassName="lg:max-w-4xl"
      noMargin
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

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;
  const isEmbed = query.isEmbedded === 'true';

  const baseUrl = constructURL(req);
  const appConfig = await getAppConfig(baseUrl);

  const content = getConfigValue(appConfig, 'emergency-banner-ltt');
  const emergencyBannerContent = parseEmergencyBanner(content);

  return {
    props: {
      price: query['price'] ? String(query['price']).replace(/,/g, '') : '',
      buyerType: query['buyerType'] || '',
      calculated: !!query['calculated'] || false,
      isEmbed,
      day: query['day'] ? String(query['day']) : null,
      month: query['month'] ? String(query['month']) : null,
      year: query['year'] ? String(query['year']) : null,
      emergencyBannerContent,
    },
  };
};
