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
import { getPageDataFromMemory } from 'lib/util/cache/cache';
import { sumFields } from 'lib/util/summaryCalculations/calculations';

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

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const result = await getServerSideDefaultProps(context);
  if ('props' in result) {
    const props = result.props as RetirementBudgetPlannerPageProps &
      NavigationDataProps &
      CachedDataProps;
    const summaryData = {
      [SUMMARY_PROPS.INCOME]: sumFields(
        getPageDataFromMemory(PAGES_NAMES.INCOME),
        'Frequency',
      ),
      [SUMMARY_PROPS.SPENDING]: sumFields(props.pageData, 'Frequency'),
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
