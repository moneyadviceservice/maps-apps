import { useEffect } from 'react';

import CompareAccounts, {
  AccountProps,
} from 'components/CompareAccounts/CompareAccounts';

import ChevronLeft from '@maps-react/common/assets/images/chevron-left.svg';
import { Button } from '@maps-react/common/components/Button';
import { Container } from '@maps-react/core/components/Container';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import compareAccountsGetServerSideProps from '../../utils/CompareAccounts/compareAccountsGetServerSideProps';

type CompareAccountsProps = {
  accounts: AccountProps[];
  totalItems: number;
  lastUpdated: string;
  isEmbed?: boolean;
};

const CompareAccountsPage = ({
  accounts,
  totalItems,
  lastUpdated,
  isEmbed,
}: CompareAccountsProps) => {
  const { z, locale } = useTranslation();
  const { addEvent } = useAnalytics();

  const title = z({
    en: 'Compare bank accounts',
    cy: 'Cymharu cyfrifon banc',
  });

  const analyticsPageTitle = z({
    en: `${title} - MoneyHelper Tools`,
    cy: `${title} - Teclynnau HelpwrArian`,
  });

  useEffect(() => {
    addEvent({
      event: 'pageLoadReact',
      page: {
        pageName: 'use-our-compare-bank-account-fees-and-charges-tool',
        pageTitle: analyticsPageTitle,
        lang: locale,
        categoryLevels: ['Everyday money', 'Banking and payments'],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: isEmbed ? 'embedded' : 'direct',
      },
      tool: {
        toolName: 'Compare Bank Accounts',
        toolCategory: '',
        toolStep: '1',
        stepName: 'Compare bank accounts',
      },
    });
  });

  const children = (
    <>
      <Container>
        <Button
          variant="link"
          as="a"
          iconLeft={<ChevronLeft />}
          className="mb-8"
          href="https://www.moneyhelper.org.uk/en/everyday-money/banking/compare-bank-account-fees-and-charges"
        >
          {z({ en: 'Back', cy: 'Yn ôl' })}
        </Button>
      </Container>

      <hr className="hidden mb-8 lg:block border-slate-400" />
      <CompareAccounts
        accounts={accounts}
        totalItems={totalItems}
        lastUpdated={lastUpdated}
      />
    </>
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      showContactUs={false}
      noMargin={true}
      headingLevel="h2"
    >
      {children}
    </ToolPageLayout>
  );
};

export const getServerSideProps = compareAccountsGetServerSideProps;
export default CompareAccountsPage;
