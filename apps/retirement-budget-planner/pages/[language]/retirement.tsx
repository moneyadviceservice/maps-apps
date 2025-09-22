import RetirementIncomeDetails from 'components/RetirementIncomeDetails';
import { retirementIncomeContentPerPartner } from 'data/retirementIncomeData';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import { getPageContent } from 'lib/util/contentFilter/contentFilter';

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
    >
      <RetirementIncomeDetails
        content={getPageContent(retirementIncomeContentPerPartner, t, partners)}
        pageData={pageData}
        fieldNames={fieldGroupNames}
      />
    </RetirementPlannerLayout>
  );
};

export default RetirementPage;

export const getServerSideProps = getServerSideDefaultProps;
