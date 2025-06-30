import { GetServerSideProps } from 'next';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { StampDutyCalculator } from '../../components/StampDutyCalculator';
import { stampDutyCalculatorConfig } from '../../data/sdlt/stampDutyCalculatorConfig';

type Props = {
  price: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  isEmbed: boolean;
};

const Page = ({ price, buyerType, calculated, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  const toolHref = stampDutyCalculatorConfig.pagePath;

  const title = z({
    en: 'Stamp Duty Calculator',
    cy: 'Cyfrifiannell treth stamp',
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
      en: 'Stamp Duty Calculator Results',
      cy: 'Canlyniadau cyfrifiannell Treth Stamp',
    });
  } else {
    pageTitle = z({
      en: 'Stamp Duty Calculator',
      cy: 'Cyfrifiannell treth stamp',
    });
  }

  const initialPageData = {
    page: {
      pageName: `sdlt-calculator${calculated ? ' results' : ''}`,
      pageTitle: pageTitle,
    },
    tool: {
      toolName: 'SDLT Calculator',
      toolStep: calculated && !error ? 2 : 1,
      stepName: calculated && !error ? 'Results' : 'Calculate',
      pagePath: toolHref,
    },
  };

  addPage([{ ...initialPageData, event: 'pageLoadReact' }]);

  const children = (
    <StampDutyCalculator
      propertyPrice={price}
      buyerType={buyerType}
      calculated={calculated}
      analyticsData={initialPageData}
      isEmbedded={isEmbed}
    />
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      headingClassName="mx-auto lg:max-w-4xl"
      noMargin
    >
      {children}
    </ToolPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const isEmbed = query.isEmbedded === 'true';
  return {
    props: {
      price: query['price'] ? String(query['price']).replace(/,/g, '') : '',
      buyerType: query['buyerType'] || '',
      calculated: !!query['calculated'] || false,
      isEmbed,
    },
  };
};
