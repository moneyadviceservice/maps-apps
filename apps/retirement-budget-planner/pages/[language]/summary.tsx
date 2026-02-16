import { GetServerSideProps } from 'next';

import { SummaryResults } from 'components/SummaryResults';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
  ServerSideProps,
} from 'lib/types/page.type';

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
  summaryData,
}: RetirementBudgetPlannerPageProps & NavigationDataProps) => {
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
      summaryData={summaryData}
    >
      <SummaryResults />
    </RetirementPlannerLayout>
  );
};

export default SummaryPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const result = await getServerSideDefaultProps(context);
  return result;
};
