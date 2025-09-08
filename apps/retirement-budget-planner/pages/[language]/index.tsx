import { GetServerSideProps } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import { RetirementIncomeGroupFields } from 'data/retirementIncomeData';
import { getPageEnum } from 'lib/constants/pageConstants';
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
  getPartnersNames,
} from 'lib/util/contentFilter/contentFilter';
import {
  getInitialTabData,
  getPageTitle,
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
  RetirementBudgetPlannerPageProps & NavigationDataProps & CachedDataProps
> = async (context) => {
  const { query, params, req } = context;
  const { stepsEnabled } = query;
  let tabName = '';
  try {
    tabName = getTabNameFromParams(req?.url, params as Record<string, string>);
  } catch (e) {
    console.error(e);
  }
  const search = new URLSearchParams(query as Record<string, string>);

  const { initialActiveTabId, initialEnabledTabCount } = getInitialTabData(
    TAB_NAMES,
    tabName,
    stepsEnabled as string,
  );

  const title: string = getPageTitle(TAB_NAMES, tabName);

  const pageData = getPageDataFromMemory(tabName);
  const additionalContent = getAdditionalDataFromMemory(tabName);

  const partners = getPartnersNames();

  const fieldGroupNames =
    createDynamicContent(
      RetirementIncomeGroupFields(partners),
      additionalContent,
    ) || [];

  return {
    props: {
      initialActiveTabId,
      initialEnabledTabCount,
      navTabsData: TAB_NAMES,
      title,
      tabName: getPageEnum(tabName),
      pageTitle: `Retirment Budget Planner: ${tabName} - Pension Wise`,
      isEmbedded: search?.get('isEmbedded') === 'true',
      pageData: pageData ?? {},
      partners,
      fieldGroupNames,
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
