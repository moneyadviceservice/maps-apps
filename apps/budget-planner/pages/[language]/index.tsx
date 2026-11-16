import { ReactNode, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { PreviewData } from 'next/types';

import ResponsiveTabs, { Tab } from 'components/ResponsiveTabs';
import tabs, { API_ENDPOINT } from 'data/budget-planner';
import { Result as SPResult } from 'data/scenario-planner/result';
import {
  clearBudgetPlannerStore,
  useBudgetPlannerData,
} from 'hooks/useBudgetPlannerData';
import { searchBudgetDataBySessionId } from 'lib/dbSearch';
import { ParsedUrlQuery } from 'querystring';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Crumb } from '@maps-react/common/components/Breadcrumb';
import { Heading } from '@maps-react/common/components/Heading';
import { EmergencyBanner } from '@maps-react/core/components/EmergencyBanner';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

import {
  fetchDataFromCache,
  saveDataToCache,
} from '../../lib/netlify/netlifyBlob';

export type Props = {
  children?: ReactNode;
  guidance?: SPResult;
  data: { [key: string]: Record<string, any> };
  sectionTestClassName?: string;
  isEmbedded?: boolean;
  tabName: string | null;
  tabAction?: string;
  fullUrl: string;
  query: { [Key: string]: string | string[] | undefined };
  emergencyBannerContent?: {
    en: string;
    cy: string;
  } | null;
};

const metaData = (t: ReturnType<typeof useTranslation>['t']): ReactNode => (
  <>
    <meta property="og:title" content={t('site.meta.og-title')}></meta>
    <meta property="og:url" content={t('site.meta.og-url')}></meta>
    <meta property="og:type" content="WEBSITE"></meta>
    <meta property="og:site_name" content="MaPS"></meta>
    <meta
      property="og:image"
      content="https://www.moneyhelper.org.uk/content/dam/maps/en/l2-images/woman-with-baby-using-laptop.jpg"
    ></meta>
    <meta property="og:image:width" content="624"></meta>
    <meta property="og:image:height" content="350"></meta>
    <meta
      property="og:description"
      content={t('site.meta.og-description')}
    ></meta>
  </>
);

export const BudgetPlannerPageWrapper = ({
  children,
  title,
  pageTitle,
  isEmbedded = false,
  breadcrumbs,
  emergencyBannerContent,
}: {
  children: ReactNode;
  title: string;
  pageTitle?: string;
  isEmbedded: boolean | undefined;
  breadcrumbs?: Crumb[];
  emergencyBannerContent?: {
    en: string;
    cy: string;
  } | null;
}) => {
  const { t } = useTranslation();

  if (isEmbedded) {
    return <EmbedPageLayout title={title}>{children}</EmbedPageLayout>;
  }

  return (
    <ToolPageLayout
      tags={metaData(t)}
      title={title}
      pageTitle={pageTitle}
      headingLevel="h4"
      breadcrumbs={breadcrumbs}
      noMargin={true}
      layout="grid"
      mainClassName="flex flex-col"
      topInfoSection={
        emergencyBannerContent && (
          <EmergencyBanner content={emergencyBannerContent} />
        )
      }
    >
      {children}
    </ToolPageLayout>
  );
};

export default function BudgetPlanner({
  children,
  data,
  sectionTestClassName = '',
  isEmbedded,
  tabName,
  query,
  emergencyBannerContent,
}: Readonly<Props>) {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const router = useRouter();
  const { budgetData, setBudgetData, hydrated } = useBudgetPlannerData();
  const { addEvent } = useAnalytics();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  isEmbedded = !!isEmbedded || router.query.isEmbedded === 'true';

  const tab = tabs.find(({ name }) => name === tabName);
  const toolTitle = t('site.tool-name');
  const tabTitle = tab ? t(`${tab.name}/title`) : '';

  const { reset, ckey } = query;
  const sessionID = query.sessionID ? String(query.sessionID) : null;

  const title = tab ? `${toolTitle}: ${tabTitle}` : '';

  const seededRef = useRef(false);
  useEffect(() => {
    if (!hydrated || seededRef.current) return;
    seededRef.current = true;
    if (
      Object.keys(budgetData).length === 0 &&
      data &&
      Object.keys(data).length > 0
    ) {
      setBudgetData(data);
    }
  }, [hydrated, budgetData, data, setBudgetData]);

  useEffect(() => {
    if (reset === 'true') {
      setBudgetData({});
      clearBudgetPlannerStore();
    }
  }, [reset, setBudgetData]);

  useEffect(() => {
    const tabIndex = findTabIndex(String(tabName));
    const stepName = getStepName(tabIndex);
    const tabNameACDL = formatTabName(String(tabName));

    const pageData = createPageData(tabIndex, String(stepName), tabNameACDL);
    addEvent(pageData);

    handleReturningQuery(pageData);
  }, [tabName, query]);

  useEffect(() => {
    if (!hydrated || String(tabName) !== 'income') return;
    const userData = Object.keys(budgetData).length > 0 ? budgetData : data;
    const incomeTabEvent = getIncomeTabEvent('income', userData);
    if (incomeTabEvent) {
      const tabIndex = findTabIndex('income');
      const pageData = createPageData(
        tabIndex,
        String(getStepName(tabIndex)),
        formatTabName('income'),
      );
      addEvent({ ...pageData, event: incomeTabEvent });
    }
  }, [hydrated, tabName, query]);

  // Helper functions
  const findTabIndex = (tabName: string) => {
    return tabs.findIndex((tab) => tab.name === tabName);
  };

  const getStepName = (tabIndex: number) => {
    return tabs[tabIndex] && tEn(`${tabs[tabIndex].name}/title`);
  };

  const formatTabName = (tabName: string) => {
    if (typeof tabName === 'string') {
      if (['family-friends', 'finance-insurance'].includes(tabName)) {
        return tabName.split('-').join('-&-');
      }
      return tabName;
    }
    return '';
  };

  const createPageData = (
    tabIndex: number,
    stepName: string,
    tabNameACDL: string,
  ) => ({
    page: {
      pageName: `budget-planner--${tabNameACDL}`,
      pageTitle: t('site.analytics.tab-page-title', {
        title: String(tabs[tabIndex] && t(`${tabs[tabIndex].name}/title`)),
      }),
      lang: locale,
      site: 'moneyhelper',
      pageType: 'tool page',
      source: isEmbedded ? 'embedded' : 'direct',
      categoryLevels: ['Everyday money', 'Budgeting'],
    },
    tool: {
      toolName: 'Budget Planner',
      toolCategory: '',
      toolStep: tabIndex + 1,
      stepName: String(stepName),
    },
    event: 'pageLoadReact',
  });

  const getIncomeTabEvent = (tabName: string, userData: any) => {
    if (tabName === 'income') {
      if (!reset) {
        return Object.keys(userData).length === 0 ? 'toolStart' : undefined;
      }
      return 'toolRestart';
    }
    return undefined;
  };

  const handleReturningQuery = (pageData: any) => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';

    if (query.returning === 'true') {
      pageData.page.url = origin + router.asPath;
      addEvent({
        ...pageData,
        event: 'toolResumed',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = (index + 1) % tabs.length;
      tabRefs.current[nextTab]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = (index - 1 + tabs.length) % tabs.length;
      tabRefs.current[prevTab]?.focus();
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <BudgetPlannerPageWrapper
      title={toolTitle}
      pageTitle={[title, '-', t('site.money-helper-tools')].join(' ')}
      isEmbedded={isEmbedded}
      emergencyBannerContent={emergencyBannerContent}
    >
      <form method="post">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="currentTab" value={tabName ?? ''} />
        <input type="hidden" name="ckey" value={ckey} />
        <input type="hidden" name="sessionID" value={sessionID ?? ''} />
        <input
          type="hidden"
          name="isEmbedded"
          value={isEmbedded ? 'true' : ''}
        />
        <GridContainer
          className={`${sectionTestClassName} ${isEmbedded && 'pb-5'} mt-5`}
        >
          {tab && (
            <div className="col-span-12">
              <ResponsiveTabs
                testClassName="print:hidden t-step-navigation"
                role="tablist"
              >
                {tabs.map(({ name }, index) => {
                  return (
                    <Tab
                      key={name + index}
                      isActive={tab?.name === name}
                      formAction={`${API_ENDPOINT}/${name}`}
                      testClassName="t-step-navigation__button"
                      onClick={(e) => {
                        if (isEmbedded) return;
                        e.preventDefault();

                        router.push({
                          pathname: `/${locale}/${name}`,
                          query: {
                            ...router.query,
                            returning: false,
                            reset: undefined,
                            isEmbedded: 'false',
                          },
                          // Default to undefined for desktop users
                          // This scrolls to the tab on mobile
                          hash: isMobile ? name : undefined,
                        });
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      role="tab"
                      ref={(el: HTMLButtonElement | null) => {
                        tabRefs.current[index] = el;
                      }}
                      aria-selected={tab?.name === name}
                      tabIndex={tab?.name === name ? 0 : -1}
                      aria-controls={`tabpanel-${index}`}
                    >
                      {t(`${name}/title`)}
                    </Tab>
                  );
                })}
              </ResponsiveTabs>
            </div>
          )}

          <div className="col-span-12 lg:col-span-10">
            {tabName === 'income' && !isEmbedded ? (
              <>
                <div className="flex items-center pb-3 mt-1 text-magenta-500 group">
                  <BackLink
                    href={`https://www.moneyhelper.org.uk/${locale}/everyday-money/budgeting/budget-planner`}
                  >
                    {t('site.back')}
                  </BackLink>
                </div>
                <Heading
                  level="h1"
                  className="pb-6 md:pb-10 md:pt-4 text-blue-700 text-[34px] md:text-[56px]"
                >
                  {tabTitle}
                </Heading>
              </>
            ) : (
              <Heading
                level="h1"
                id={tabName ?? ''}
                className="pb-6 md:pb-10 md:pt-4 text-blue-700 text-[34px] md:text-[56px]"
              >
                {tabTitle}
              </Heading>
            )}
          </div>

          {children}
        </GridContainer>
      </form>
    </BudgetPlannerPageWrapper>
  );
}

interface ServerSideDefaultProps {
  data?: any;
  tabName?: string | string[] | null;
  isEmbedded?: boolean;
  fullUrl?: string;
  query: { [Key: string]: string | string[] | undefined };
  sessionID?: string | null;
  emergencyBannerContent?: {
    en: string;
    cy: string;
  } | null;
}

export const getServerSidePropsDefault: GetServerSideProps<
  ServerSideDefaultProps
> = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
): Promise<{ props: ServerSideDefaultProps }> => {
  const { req, query, params } = context;

  const protocol = req.headers?.referer?.startsWith('https') ? 'https' : 'http';
  const fullUrl = encodeURI(
    protocol.concat('://', req.headers?.host ?? '', req?.url ?? ''),
  );
  let data = {};
  let sessionDataFetched = false;

  const fetchDataFromDB = async (sessionID: string) => {
    try {
      const dbData = await searchBudgetDataBySessionId(sessionID);
      if (dbData) {
        saveDataToCache(dbData, `budget-planner_session_${sessionID}`);
        return dbData;
      }
    } catch (error) {
      console.error('Error fetching data from database:', error);
    }
    return {};
  };

  if (query.sessionID) {
    const sessionID = String(query.sessionID);

    if (query.ckey) {
      const sessionData = await fetchDataFromCache(
        `budget-planner_session_${sessionID}`,
      );
      const cacheData = await fetchDataFromCache(
        `budget-planner_${query.ckey}`,
      );
      data = { ...sessionData, ...cacheData };
      sessionDataFetched = !!Object.keys(sessionData).length;
    }

    if (!sessionDataFetched) {
      data = await fetchDataFromDB(sessionID);
    }
  }

  if (!query.sessionID && query.ckey) {
    data = await fetchDataFromCache(`budget-planner_${query.ckey}`);
  }

  const isEmbed = query.isEmbedded === 'true';
  const appConfig = await getServerSideAppConfig(req);
  const emergencyBannerContent = parseEmergencyBanner(
    appConfig.getValue('emergency-banner'),
  );

  try {
    return {
      props: {
        data,
        tabName: params?.tabName || null,
        isEmbedded: isEmbed,
        fullUrl,
        query,
        sessionID: query.sessionID ? String(query.sessionID) : null,
        emergencyBannerContent,
      },
    };
  } catch (error) {
    console.error('There has been an error', { error });
    return {
      props: {
        query,
        sessionID: query.sessionID ? String(query.sessionID) : null,
        emergencyBannerContent,
      },
    };
  }
};

interface AdditionalParams extends ParsedUrlQuery {
  language: string;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const search = new URLSearchParams(query as Record<string, string>);
  const language = (params as AdditionalParams).language;
  const [tab] = tabs;

  return {
    redirect: {
      statusCode: 303, // @note: Status code "See Other".
      destination: `/${language}/${tab.name}?${search}`,
    },
  };
};
