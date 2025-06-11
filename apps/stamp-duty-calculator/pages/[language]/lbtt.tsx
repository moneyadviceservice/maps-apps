import { GetServerSideProps } from 'next';

import { sdcBreadcrumbs } from 'utils/sdcBreadcrumbs';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { LandBuildingsTransactionTaxCalculator } from '../../components/LandBuildingsTransactionTaxCalculator';

type Props = {
  price: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  isEmbed: boolean;
};

const Page = ({ price, buyerType, calculated, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  const toolHref = z({
    en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
    cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
  });
  const title = z({
    en: 'Land and Buildings Transaction Tax (LBTT) calculator',
    cy: 'Cyfrifiannell Treth Trafodion Tir ac Adeiladau',
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
      en: 'Land and Buildings Transaction Tax Calculator Results',
      cy: 'Canlyniad cyfrifiannell Treth Trafodiadau Tir ac Adeiladau (LBTT)',
    });
  } else {
    pageTitle = z({
      en: 'Land and Buildings Transaction Tax Calculator',
      cy: 'Cyfrifiannell Treth Trafodion Tir ac Adeiladau',
    });
  }

  const breadcrumbTitle = z({
    en: 'Land and Buildings Transaction Tax Calculator home',
    cy: 'Hafan cyfrifiannell Treth Tir ac Adeiladau',
  });

  const initialPageData = {
    page: {
      pageName: `lbtt-calculator${calculated ? ' results' : ''}`,
      pageTitle: pageTitle,
    },
    tool: {
      toolName: 'LBTT Calculator',
      toolStep: calculated && !error ? 2 : 1,
      stepName: calculated && !error ? 'Results' : 'Calculate',
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
    />
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      breadcrumbs={sdcBreadcrumbs({ z, toolHref, breadcrumbTitle })}
      pageTitle={pageTitle}
      headingClassName="mx-auto lg:max-w-4xl"
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
