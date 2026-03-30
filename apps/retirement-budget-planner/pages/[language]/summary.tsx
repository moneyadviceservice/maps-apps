import { GetServerSideProps } from 'next';

import { SummaryResults } from 'components/SummaryResults';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import { PAGES_NAMES } from 'lib/constants/pageConstants';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
  ServerSideProps,
  SummaryCachedData,
} from 'lib/types/page.type';
import { getDataFromMemory, getPartnersFromRedis } from 'lib/util/cacheToRedis';
import {
  redirectToAboutYouPage,
  validateSession,
} from 'lib/util/validateSession/validateSession';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';

const SummaryPage = ({
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
  sessionId,
  income,
  costs,
  divisor,
  partner,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  SummaryCachedData) => {
  const { t } = useTranslation();

  return (
    <RetirementPlannerLayout
      title={t('summaryPage.title')}
      pageTitle={pageTitle}
      tabName={tabName}
      initialActiveTabId={initialActiveTabId}
      initialEnabledTabCount={initialEnabledTabCount}
      navTabsData={navTabsData}
      isEmbedded={isEmbedded}
      sessionId={sessionId}
      useInformizely={true}
    >
      <SummaryResults
        income={income}
        costs={costs}
        divisor={divisor}
        tabName={tabName}
        partner={partner}
        sessionId={sessionId}
      />
    </RetirementPlannerLayout>
  );
};

export default SummaryPage;

export const getServerSideProps: GetServerSideProps<
  ServerSideProps & SummaryCachedData
> = async (context) => {
  const { params, query } = context;
  const divisor = query?.divisor as string;

  const result = await getServerSideDefaultProps(context);
  let costs = {},
    income = {};

  if ('props' in result) {
    const props = result.props as RetirementBudgetPlannerPageProps &
      NavigationDataProps &
      CachedDataProps;
    const { sessionId, tabName } = props;

    //Validate session - check if aboutyou information are cached
    let aboutyouData = null;
    if (sessionId) aboutyouData = await getPartnersFromRedis(sessionId);

    if (validateSession(aboutyouData, tabName))
      return redirectToAboutYouPage(params?.language as string);

    if (sessionId) {
      const cachedIncome = await getDataFromMemory(
        sessionId,
        PAGES_NAMES.INCOME,
      );
      income = cachedIncome?.pageData ?? {};
      const cachedcosts = await getDataFromMemory(
        sessionId,
        PAGES_NAMES.ESSENTIALS,
      );
      costs = cachedcosts?.pageData ?? {};
    }

    return {
      props: {
        ...props,
        income,
        costs,
        divisor: divisor ?? '',
        partner: aboutyouData,
      },
    };
  }

  return result;
};
