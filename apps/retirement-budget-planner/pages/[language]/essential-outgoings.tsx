import { EssentialOutgoings } from 'components/EssentialOutgoings/EssentialOutgoings';
import {
  essentialOutgoingsContent,
  essentialOutgoingsItems,
} from 'data/essentialOutgoingsData';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';

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
    >
      <EssentialOutgoings
        pageData={pageData}
        fieldNames={essentialOutgoingsItems(t)}
        pageContent={essentialOutgoingsContent(t, '')}
      />
    </RetirementPlannerLayout>
  );
};

export default TabPage;

export const getServerSideProps = getServerSideDefaultProps;
