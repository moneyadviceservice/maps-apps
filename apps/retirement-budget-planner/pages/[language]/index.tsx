import { GetServerSideProps } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import { retirementIncomefieldNames } from 'data/retirementIncomeData';
import { PAGES_NAMES } from 'lib/constants/pageConstants';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import {
  getAdditionalDataFromMemory,
  getPageDataFromMemory,
} from 'lib/util/cache/cache';
import {
  createDynamicContent,
  getGroupFieldConfigs,
  getPartnersNames,
} from 'lib/util/contentFilter/contentFilter';
import {
  getInitialTabData,
  getTabNameFromParams,
} from 'lib/util/pageFilter/pageFilter';

import { Container } from '@maps-react/core/components/Container';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const Page = () => {
  return (
    <ToolPageLayout>
      <Container> Landing page</Container>
    </ToolPageLayout>
  );
};
export default Page;

export const getServerSideDefaultProps: GetServerSideProps<
  Omit<RetirementBudgetPlannerPageProps, 'summaryData'> &
    NavigationDataProps &
    CachedDataProps
> = async (context) => {
  const { query, req } = context;
  const { stepsEnabled } = query;

  const parsedUrl = new URLSearchParams(req.url);
  const sessionId = parsedUrl.get('sessionId') || null;

  let tabName = PAGES_NAMES.ABOUTYOU;
  try {
    tabName = getTabNameFromParams(req?.url);
  } catch (e) {
    console.error(e);
  }

  const search = new URLSearchParams(query as Record<string, string>);

  const { initialActiveTabId, initialEnabledTabCount } = getInitialTabData(
    TAB_NAMES,
    tabName,
    stepsEnabled as string,
  );

  const pageData = getPageDataFromMemory(tabName);
  const additionalContent = getAdditionalDataFromMemory(tabName);

  const partners = getPartnersNames();

  const fieldGroupNames =
    createDynamicContent(
      getGroupFieldConfigs(retirementIncomefieldNames, partners),
      additionalContent,
    ) || [];

  return {
    props: {
      initialActiveTabId,
      initialEnabledTabCount,
      navTabsData: TAB_NAMES,
      tabName: tabName,
      pageTitle: `Retirment Budget Planner: ${tabName} - Pension Wise`,
      isEmbedded: search?.get('isEmbedded') === 'true',
      pageData: pageData ?? {},
      partners,
      fieldGroupNames,
      sessionId,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const lang = params?.language;
  return {
    redirect: {
      destination: `/${lang}/landing`,
      permanent: true,
    },
  };
};
