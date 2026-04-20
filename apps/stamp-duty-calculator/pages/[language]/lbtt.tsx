import { GetServerSideProps } from 'next';

import { constructPurchaseDate } from 'utils/dateUtils/constructPurchaseDate';

import { EmergencyBanner } from '@maps-react/core/components/EmergencyBanner';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

import { LandBuildingsTransactionTaxCalculator } from '../../components/LandBuildingsTransactionTaxCalculator';
import { landBuildingsTransactionTaxConfig } from '../../data/lbtt/landBuildingsTransactionTaxConfig';

type Props = {
  price: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  isEmbed: boolean;
  day?: string;
  month?: string;
  year?: string;
  emergencyBannerContent?: {
    en: string;
    cy: string;
  };
};

const Page = ({
  price,
  buyerType,
  calculated,
  isEmbed,
  day,
  month,
  year,
  emergencyBannerContent,
}: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  const toolHref = landBuildingsTransactionTaxConfig.pagePath;

  const title = z({
    en: 'Land and Buildings Transaction Tax (LBTT) calculator',
    cy: 'Cyfrifiannell Treth Trafodion Tir ac Adeiladau',
  });

  const errors =
    landBuildingsTransactionTaxConfig.validateForm?.(
      {
        price,
        buyerType,
        purchaseDate: constructPurchaseDate(day, month, year),
      },
      z,
    )?.errors ?? {};

  const error = Object.values(errors).flat().length > 0;

  const hasResult = calculated && !error;

  let pageTitle;
  if (calculated && error) {
    pageTitle = z({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    });
  } else if (hasResult) {
    pageTitle = z({
      en: 'Land and Buildings Transaction Tax Calculator Results',
      cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
    });
  } else {
    pageTitle = z({
      en: 'Land and Buildings Transaction Tax Calculator',
      cy: 'Cyfrifiannell Treth Trafodion Tir ac Adeiladau',
    });
  }

  const initialPageData = {
    page: {
      pageName: `lbtt-calculator${hasResult ? ' results' : ''}`,
      pageTitle: pageTitle,
    },
    tool: {
      toolName: 'LBTT Calculator',
      toolStep: hasResult ? 2 : 1,
      stepName: hasResult ? 'Results' : 'Calculate',
      pagePath: toolHref,
    },
  };

  addPage([{ ...initialPageData, event: 'pageLoadReact' }]);

  const children = (
    <LandBuildingsTransactionTaxCalculator
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
      layout="grid"
      mainClassName="my-8"
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

  const appConfig = await getServerSideAppConfig(req);
  const emergencyBannerContent = parseEmergencyBanner(
    appConfig.getValue('emergency-banner-lbtt'),
  );

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
