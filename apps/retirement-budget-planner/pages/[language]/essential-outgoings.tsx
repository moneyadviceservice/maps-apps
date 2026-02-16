import { GetServerSideProps } from 'next';

import { EssentialOutgoings } from 'components/EssentialOutgoings/EssentialOutgoings';
import {
  essentialOutgoingsContent,
  essentialOutgoingsItems,
} from 'data/essentialOutgoingsData';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import { PAGES_NAMES, SUMMARY_PROPS } from 'lib/constants/pageConstants';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
  ServerSideProps,
} from 'lib/types/page.type';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis/aboutYouCache';
import { getDataFromMemory } from 'lib/util/cacheToRedis/incomeEssential';
import { returningCache } from 'lib/util/cacheToRedis/returningCache';
import { sumFields } from 'lib/util/summaryCalculations/calculations';
import {
  redirectToAboutYouPage,
  validateSession,
} from 'lib/util/validateSession/validateSession';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';

const TabPage = ({
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
  pageData,
  sessionId,
  summaryData,
  error,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  CachedDataProps) => {
  const { t } = useTranslation();

  return (
    <RetirementPlannerLayout
      title={t('essentialOutgoings.title')}
      pageTitle={pageTitle}
      tabName={tabName}
      initialActiveTabId={initialActiveTabId}
      initialEnabledTabCount={initialEnabledTabCount}
      navTabsData={navTabsData}
      isEmbedded={isEmbedded}
      sessionId={sessionId}
      summaryData={summaryData}
      error={error}
    >
      <EssentialOutgoings
        pageData={pageData as Record<string, string>}
        fieldNames={essentialOutgoingsItems(t)}
        pageContent={essentialOutgoingsContent(t)}
        tabName={tabName}
        sessionId={sessionId ?? ''}
        summaryData={summaryData}
      />
    </RetirementPlannerLayout>
  );
};

export default TabPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const result = await getServerSideDefaultProps(context);

  if ('props' in result) {
    const props = result.props as RetirementBudgetPlannerPageProps &
      NavigationDataProps &
      CachedDataProps;
    const { sessionId, tabName } = props;
    const { params, query } = context;
    let incomeCachedData = null;
    let cachedData = null;

    let aboutyouData = null;
    if (sessionId) aboutyouData = await getPartnersFromRedis(sessionId);

    //Validate session - check if aboutyou information are cached
    if (validateSession(aboutyouData, tabName))
      return redirectToAboutYouPage(params?.language as string);

    if (sessionId && sessionId.length > 0) {
      // if returning query param exists then the user has returned back to page after save-and-return
      // get data from database, save to Redis and
      // return the data for about you tab
      cachedData = await returningCache(
        Boolean(query.returning),
        sessionId,
        tabName,
      );
      if (!cachedData) cachedData = await getDataFromMemory(sessionId, tabName);
      incomeCachedData = await getDataFromMemory(
        sessionId ?? '',
        PAGES_NAMES.INCOME,
      );
    }

    const summaryData = {
      [SUMMARY_PROPS.INCOME]:
        sumFields(incomeCachedData?.pageData, 'Frequency') ?? 0,
      [SUMMARY_PROPS.SPENDING]: sumFields(cachedData?.pageData, 'Frequency'),
    };

    return {
      props: {
        ...props,
        summaryData,
        pageData: cachedData?.pageData ?? {},
      },
    };
  }
  return result;
};
