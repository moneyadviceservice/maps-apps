import { GetServerSideProps } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
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
  RetirementBudgetPlannerPageProps & NavigationDataProps
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
  return {
    props: {
      initialActiveTabId,
      initialEnabledTabCount,
      navTabsData: TAB_NAMES,
      title,
      tabName: tabName || 'Index or Landing',
      pageTitle: `Retirment Budget Planner: ${tabName} - Pension Wise`,
      isEmbedded: search?.get('isEmbedded') === 'true',
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const lang = params?.language;
  return {
    redirect: {
      destination: `/${lang}/about-us`,
      permanent: true,
    },
  };
};
