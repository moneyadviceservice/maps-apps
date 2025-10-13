import { NextPage } from 'next';

import { progressSavedPageContent as content } from 'data/budget-planner';

import { H2, H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

import { BudgetPlannerPageWrapper } from '.';
import { getSavePageServerSideProps, SaveDataProps } from './save';

const Page: NextPage<SaveDataProps> = ({
  tabName,
  language,
  isEmbedded,
  sessionID,
  ckey,
}: SaveDataProps) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  const pageData: AnalyticsData[] = [
    {
      event: 'pageLoadReact',
      page: {
        pageName: 'budget-planner--save-and-come-back-later--progress-saved',
        pageTitle: z({
          en: 'Budget Planner - MoneyHelper Tools',
          cy: 'Cynlluniwr Cyllideb - Teclynnau HelpwrArian',
        }),
        categoryLevels: ['Everyday money', 'Budgeting'],
      },
      tool: {
        toolName: 'Budget Planner',
      },
    },
  ];
  addPage(pageData);

  return (
    <BudgetPlannerPageWrapper
      title={z({ en: 'Budget Planner', cy: 'Cynlluniwr Cyllideb' })}
      isEmbedded={isEmbedded}
    >
      <div className="mb-16 space-y-8">
        <H2>{z(content.title)}</H2>
        <H3>{z(content.subHeading)}</H3>
        {z(content.text)}
        <div className="flex flex-col sm:flex-row gap-x-2">
          <Link
            className="mb-4 sm:mb-0 t-continue-to-main-site"
            href={z(content.mainSiteLink)}
            asButtonVariant="primary"
            target={isEmbedded ? '_blank' : undefined}
          >
            {z(
              isEmbedded
                ? content.continueButtonLabelEmbedded
                : content.continueButtonLabel,
            )}
          </Link>
          <Link
            className="t-resend-email"
            asButtonVariant="secondary"
            href={{
              pathname: `/${language}${content.resendEmailAction}`,
              query: {
                isEmbedded: Boolean(isEmbedded),
                tabName: tabName,
                sessionID: sessionID,
                ckey: ckey,
              },
            }}
          >
            {z(content.resendEmailButtonLabel)}
          </Link>
        </div>
      </div>
    </BudgetPlannerPageWrapper>
  );
};
export const getServerSideProps = getSavePageServerSideProps;
export default Page;
