import { GetServerSideProps } from 'next';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { LandTransactionTaxCalculator } from '../../components/LandTransactionTaxCalculator';

type Props = {
  price: string;
  buyerType: 'firstOrNextHome' | 'additionalHome';
  calculated: boolean;
  isEmbed: boolean;
};

const Page = ({ price, buyerType, calculated, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  const toolHref = z({
    en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator',
    cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator',
  });

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

  const breadcrumbTitle = z({
    en: 'Land Transaction Tax Calculator home',
    cy: 'Hafan Cyfrifiannell Treth Trafodiadau Tir',
  });

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

  addPage([initialPageData]);

  const breadcrumbs = [
    {
      label: 'Home',
      link: 'https://www.moneyhelper.org.uk/',
      id: 'home',
    },
    {
      label: z({ en: 'Homes', cy: 'Cartrefi' }),
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/homes',
        cy: 'https://www.moneyhelper.org.uk/cy/homes',
      }),
    },
    {
      label: z({ en: 'Buying a home', cy: 'Prynu cartref' }),
      link: z({
        en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home',
        cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home',
      }),
    },
    {
      label: breadcrumbTitle,
      link: toolHref,
    },
  ];

  const children = (
    <LandTransactionTaxCalculator
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
      breadcrumbs={breadcrumbs}
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
