import { GetServerSideProps } from 'next';

import RetirementIncomeDetails from 'components/RetirementIncomeDetails';
import {
  retirementIncomeContentPerPartner,
  retirementIncomefieldNames,
  statePensionFields,
} from 'data/retirementIncomeData';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import { PAGES_NAMES, SUMMARY_PROPS } from 'lib/constants/pageConstants';
import { Partner } from 'lib/types/aboutYou';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
  RetirementFieldTypes,
  ServerSideProps,
} from 'lib/types/page.type';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis/aboutYouCache';
import { getDataFromMemory } from 'lib/util/cacheToRedis/incomeEssential';
import {
  concatStaticDynamicFields,
  createDynamicContent,
  getGroupFieldConfigs,
  getPageContent,
} from 'lib/util/contentFilter/contentFilter';
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
  partnerNames,
  fieldGroupNames,
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
        content={getPageContent(
          retirementIncomeContentPerPartner,
          t,
          partnerNames ?? [],
        )}
        pageData={pageData}
        fieldNames={concatStaticDynamicFields(
          statePensionFields,
          t,
          partnerNames ?? [],
          fieldGroupNames,
        )}
        tabName={tabName}
        sessionId={sessionId}
        summaryData={summaryData}
        stepsEnabled={stepsEnabled}
      />
    </RetirementPlannerLayout>
  );
};

export default RetirementPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const { params, query } = context;
  const result = await getServerSideDefaultProps(context);

  if ('props' in result) {
    const props = result.props as RetirementBudgetPlannerPageProps &
      NavigationDataProps &
      CachedDataProps;
    const { sessionId, tabName } = props;
    let cachedData = null;
    let essntialOutgoings = null;
    if (sessionId && sessionId.length > 0) {
      cachedData = await getDataFromMemory(sessionId, tabName);
      essntialOutgoings = await getDataFromMemory(
        props.sessionId || '',
        PAGES_NAMES.ESSENTIALS,
      );
    }

    let aboutyouData = null;
    if (sessionId) aboutyouData = await getPartnersFromRedis(sessionId);

    const partnerNames = aboutyouData.map((p: Partner) => p.name);

    if (validateSession(aboutyouData, tabName))
      return redirectToAboutYouPage(params?.language as string);

    let fieldGroupNames: RetirementFieldTypes[] = [];

    if (cachedData?.additionalFields)
      fieldGroupNames =
        createDynamicContent(
          getGroupFieldConfigs(retirementIncomefieldNames, partnerNames),
          cachedData?.additionalFields,
        ) || [];
    else
      fieldGroupNames = getGroupFieldConfigs(
        retirementIncomefieldNames,
        partnerNames,
      );

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
        partnerNames,
        fieldGroupNames,
        summaryData,
        stepsEnabled: query.stepsEnabled,
      },
    };
  }
  return result;
};
