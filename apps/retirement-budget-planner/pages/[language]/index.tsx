import { GetServerSideProps } from 'next';

import { TAB_NAMES } from 'data/navigationData';
import { PAGES_NAMES } from 'lib/constants/pageConstants';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import {
  getInitialTabData,
  getTabNameFromParams,
} from 'lib/util/pageFilter/pageFilter';
import { redirectToAboutYouPage } from 'lib/util/validateSession/validateSession';

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
  const { query, req, params } = context;
  const search = new URLSearchParams(query as Record<string, string>);
  const sessionId = search.get('sessionId');
  const stepsEnabled = search.get('stepsEnabled');
  const error = search.get('error');

  let tabName = PAGES_NAMES.ABOUTYOU;
  try {
    tabName = getTabNameFromParams(req?.url);
  } catch (e) {
    console.error(e);
  }

  //if in retirement income or essential outgoings tab and
  // sessionid is not present then redirect to the about-you page

  if (tabName !== PAGES_NAMES.ABOUTYOU && !sessionId)
    return redirectToAboutYouPage(params?.language as string);

  const { initialActiveTabId } = getInitialTabData(TAB_NAMES, tabName);

  return {
    props: {
      initialActiveTabId,
      initialEnabledTabCount: Number(stepsEnabled) || 1,
      navTabsData: TAB_NAMES,
      tabName: tabName,
      pageTitle: `Retirment Budget Planner: ${tabName} - Pension Wise`,
      isEmbedded: search?.get('isEmbedded') === 'true',
      sessionId: sessionId as string | undefined,
      error,
      pageData: {}, // Replace with actual page data if available
      fieldGroupNames: [], // Replace with actual field group names if available
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
