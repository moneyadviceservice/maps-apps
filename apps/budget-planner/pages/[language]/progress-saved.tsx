import { NextPage } from 'next';

import { progressSavedPageContent as content } from 'data/budget-planner';

import { H2, H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { GridContainer } from '@maps-react/core/components/GridContainer';
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
  const { t, tList } = useTranslation();
  const { addPage } = useAnalytics();

  const pageData: AnalyticsData[] = [
    {
      event: 'pageLoadReact',
      page: {
        pageName: 'budget-planner--save-and-come-back-later--progress-saved',
        pageTitle: t('site.analytics.page-title'),
        categoryLevels: ['Everyday money', 'Budgeting'],
      },
      tool: {
        toolName: 'Budget Planner',
      },
    },
  ];
  addPage(pageData);

  return (
    <BudgetPlannerPageWrapper title={t('site.title')} isEmbedded={isEmbedded}>
      <GridContainer>
        <div className="col-span-12 lg:col-span-10 xl:col-span-8 mb-16 space-y-8">
          <H2>{t('pages.progress-saved.title')}</H2>
          <H3>{t('pages.progress-saved.sub-heading')}</H3>
          {tList('pages.progress-saved.text').map((paragraph: string) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="flex flex-col sm:flex-row gap-x-2">
            <Link
              className="justify-center mb-4 sm:mb-0 t-continue-to-main-site"
              href={t('pages.progress-saved.main-site-link')}
              asButtonVariant="primary"
              target={isEmbedded ? '_blank' : undefined}
            >
              {t(
                isEmbedded
                  ? 'pages.progress-saved.continue-embedded'
                  : 'pages.progress-saved.continue',
              )}
            </Link>
            <Link
              className="flex justify-center t-resend-email"
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
              {t('pages.progress-saved.resend-email')}
            </Link>
          </div>
        </div>
      </GridContainer>
    </BudgetPlannerPageWrapper>
  );
};
export const getServerSideProps = getSavePageServerSideProps;
export default Page;
