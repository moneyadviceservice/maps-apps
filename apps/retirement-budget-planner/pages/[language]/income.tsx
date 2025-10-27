import { GetServerSideProps } from 'next';

import RetirementIncomeDetails from 'components/RetirementIncomeDetails';
import {
  retirementIncomeContentPerPartner,
  statePensionFields,
} from 'data/retirementIncomeData';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import { PAGES_NAMES, SUMMARY_PROPS } from 'lib/constants/pageConstants';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
  ServerSideProps,
} from 'lib/types/page.type';
import { getPageDataFromMemory } from 'lib/util/cache/cache';
import {
  concatStaticDynamicFields,
  getPageContent,
} from 'lib/util/contentFilter/contentFilter';
import { sumFields } from 'lib/util/summaryCalculations/calculations';

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
  partners,
  fieldGroupNames,
  sessionId,
  summaryData,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  CachedDataProps) => {
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
    >
      <RetirementIncomeDetails
        content={getPageContent(retirementIncomeContentPerPartner, t, partners)}
        pageData={pageData}
        fieldNames={concatStaticDynamicFields(
          statePensionFields,
          t,
          partners,
          fieldGroupNames,
        )}
      />
    </RetirementPlannerLayout>
  );
};

export default RetirementPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const result = await getServerSideDefaultProps(context);
  if ('props' in result) {
    const props = result.props as RetirementBudgetPlannerPageProps &
      NavigationDataProps &
      CachedDataProps;
    const summaryData = {
      [SUMMARY_PROPS.INCOME]: sumFields(props.pageData, 'Frequency'),
      [SUMMARY_PROPS.SPENDING]: sumFields(
        getPageDataFromMemory(PAGES_NAMES.ESSENTIALS),
        'Frequency',
      ),
    };

    return {
      props: {
        ...props,
        summaryData,
      },
    };
  }
  return result;
};
