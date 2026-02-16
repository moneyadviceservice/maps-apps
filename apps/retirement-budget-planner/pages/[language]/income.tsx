import { GetServerSideProps } from 'next';

import RetirementIncomeDetails from 'components/RetirementIncomeDetails';
import {
  retirementIncomeContentPerPartner,
  retirementIncomefieldNames,
  staticIncomeSections,
} from 'data/retirementIncomeData';
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
import { createContentFromCache } from 'lib/util/contentFilter/contentFilter';
import { sumFields } from 'lib/util/summaryCalculations/calculations';
import {
  redirectToAboutYouPage,
  validateSession,
} from 'lib/util/validateSession/validateSession';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';

const RetirementPage = ({
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
  pageData,
  dynamicIndexesArray,
  sessionId,
  stepsEnabled,
  summaryData,
  error,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  CachedDataProps & { stepsEnabled: string }) => {
  const { t } = useTranslation();

  return (
    <RetirementPlannerLayout
      title={t('income.title')}
      pageTitle={pageTitle}
      tabName={tabName}
      initialActiveTabId={initialActiveTabId}
      initialEnabledTabCount={initialEnabledTabCount}
      navTabsData={navTabsData}
      isEmbedded={isEmbedded}
      description={t('income.description')}
      sessionId={sessionId}
      summaryData={summaryData}
      error={error}
    >
      <RetirementIncomeDetails
        content={retirementIncomeContentPerPartner(t)}
        pageData={pageData as Record<string, string>}
        fieldNames={[
          ...staticIncomeSections(t),
          ...createContentFromCache(
            retirementIncomefieldNames(t),
            dynamicIndexesArray,
          ),
        ]}
        tabName={tabName}
        sessionId={sessionId}
        summaryData={summaryData}
      />
    </RetirementPlannerLayout>
  );
};

export default RetirementPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const { query, params } = context;
  const { returning } = query;
  const result = await getServerSideDefaultProps(context);

  if ('props' in result) {
    const props = result.props as RetirementBudgetPlannerPageProps &
      NavigationDataProps &
      CachedDataProps;
    const { sessionId, tabName } = props;
    let cachedData = null;
    let essntialOutgoings = null;
    if (sessionId && sessionId.length > 0) {
      // if returning query param exists then the user has returned back to page after save-and-return
      // get data from database, save to Redis and
      // return the data for about you tab
      cachedData = await returningCache(Boolean(returning), sessionId, tabName);
      if (!cachedData) cachedData = await getDataFromMemory(sessionId, tabName);
      essntialOutgoings = await getDataFromMemory(
        props.sessionId || '',
        PAGES_NAMES.ESSENTIALS,
      );
    }

    let aboutyouData = null;
    if (sessionId) aboutyouData = await getPartnersFromRedis(sessionId);

    if (validateSession(aboutyouData, tabName)) {
      return redirectToAboutYouPage(params?.language as string);
    }

    const summaryData = {
      [SUMMARY_PROPS.INCOME]: sumFields(cachedData?.pageData, 'Frequency'),
      [SUMMARY_PROPS.SPENDING]: sumFields(
        essntialOutgoings?.pageData,
        'Frequency',
      ),
    };

    return {
      props: {
        ...props,
        pageData: cachedData?.pageData ?? {},
        dynamicIndexesArray: cachedData?.additionalFields ?? [],
        summaryData,
        stepsEnabled: query.stepsEnabled,
      },
    };
  }
  return result;
};
