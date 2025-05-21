import { ReactNode, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { PreviewData } from 'next/types';

import ResponsiveTabs, { Tab } from 'components/ResponsiveTabs';
import { useBudgetPlannerProvider } from 'context/BudgetPlannerDataProvider';
import tabs, { API_ENDPOINT } from 'data/budget-planner';
import { Result as SPResult } from 'data/scenario-planner/result';
import { searchBudgetDataBySessionId } from 'lib/dbSearch';
import { ParsedUrlQuery } from 'querystring';
import {
  fetchDataFromCache,
  saveDataToCache,
} from 'utils/cacheInMemory/cacheInMemory';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Crumb } from '@maps-react/common/components/Breadcrumb';
import { Heading, Level } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const YOUR_SCENARIO_TAB = 'your-scenario';

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
};

const metaData = (t: ReturnType<typeof useTranslation>['z']): ReactNode => (
  <>
    <meta
      property="og:title"
      content={t({
        en: 'Use our budget planner | MoneyHelper',
        cy: 'Cynlluniwr cyllidebc',
      })}
    ></meta>
    <meta
      property="og:url"
      content={t({
        en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/use-our-budget-planner',
        cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
      })}
    ></meta>
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
      content={t({
        en: "Use the free online Money Helper Budget Planner tools to work out how much money you have coming in and what you're spending it on.",
        cy: "Darganfyddwch ein cyfrifiannell Cynlluniwr Cyllideb HelpwrArian ar-lein am ddim i ennill dealltwriaeth well o'ch arian yn dod i mewn ac allan, a sut i wella'ch cyllid.",
      })}
    ></meta>
  </>
);

export const BudgetPlannerPageWrapper = ({
  children,
  title,
  pageTitle,
  headingLevel,
  isEmbedded = false,
  breadcrumbs,
}: {
  children: ReactNode;
  title: string;
  pageTitle?: string;
  headingLevel?: Level;
  isEmbedded: boolean | undefined;
  breadcrumbs?: Crumb[];
}) => {
  const { z } = useTranslation();
  const PageWrapper: typeof EmbedPageLayout | typeof ToolPageLayout = isEmbedded
    ? EmbedPageLayout
    : ToolPageLayout;
  return (
    <PageWrapper
      tags={metaData(z)}
      title={title}
      pageTitle={pageTitle}
      headingLevel="h4"
      breadcrumbs={breadcrumbs}
      noMargin={true}
    >
      <Container>{children}</Container>
    </PageWrapper>
  );
};

export default function BudgetPlanner({
  children,
  data,
  sectionTestClassName = '',
  isEmbedded,
  tabName,
  query,
}: Readonly<Props>) {
  const { z, locale } = useTranslation();
  const router = useRouter();
  const { dataInContext, setDataInContext } = useBudgetPlannerProvider();
  const { addEvent } = useAnalytics();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  isEmbedded = !!isEmbedded || router.query.isEmbedded === 'true';

  const tab = tabs.find(({ name }) => name === tabName);
  const toolName = { en: 'Budget planner', cy: 'Cynlluniwr Cyllideb' };
  const toolTitle = `${z(toolName)}`;
  const tabTitle = tab ? `${z(tab.title)}` : '';

  const { reset, ckey } = query;
  const sessionID = query.sessionID ? String(query.sessionID) : null;
  const getPageTitle = (tabName: string) => {
    if (tabName === YOUR_SCENARIO_TAB) {
      return z({ en: 'Life event planner', cy: 'Eich senario' });
    }
    return `${toolTitle}: ${tabTitle}`;
  };

  const title = tab ? getPageTitle(tab.name) : '';

  useEffect(() => {
    setDataInContext(data);
  }, [dataInContext, data, setDataInContext]);

  useEffect(() => {
    const tabIndex = findTabIndex(String(tabName));
    const stepName = getStepName(tabIndex);
    const tabNameACDL = formatTabName(String(tabName));

    const pageData = createPageData(tabIndex, String(stepName), tabNameACDL);
    addEvent(pageData);

    const userData = dataInContext || data;
    const incomeTabEvent = getIncomeTabEvent(String(tabName), userData);

    if (incomeTabEvent) {
      addEvent({
        ...pageData,
        event: incomeTabEvent,
      });
    }

    handleReturningQuery(pageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName, query]);

  // Helper functions
  const findTabIndex = (tabName: string) => {
    return tabs.findIndex((tab) => tab.name === tabName);
  };

  const getStepName = (tabIndex: number) => {
    return tabs[tabIndex]?.title.en;
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
      pageTitle: z({
        en: `Budget planner: ${tabs[tabIndex]?.title.en} - MoneyHelper Tools`,
        cy: `Cynlluniwr Cyllideb: ${tabs[tabIndex]?.title.cy} - Teclynnau HelpwrArian`,
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
      pageTitle={[
        title,
        '-',
        z({ en: 'MoneyHelper Tools', cy: 'Teclynnau HelpwrArian' }),
      ].join(' ')}
      isEmbedded={isEmbedded}
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
        {tab && (
          <ResponsiveTabs
            testClassName="print:hidden t-step-navigation"
            role="tablist"
          >
            {tabs.map(({ name, title }, index) => {
              return (
                <Tab
                  key={name + index}
                  isActive={tab?.name === name}
                  formAction={`${API_ENDPOINT}/${name}`}
                  testClassName="t-step-navigation__button"
                  onClick={(e) => {
                    e.preventDefault();

                    router.push({
                      pathname: `/${locale}/budget-planner/${name}`,
                      query: {
                        ...router.query,
                        returning: false,
                        isEmbedded: isEmbedded ? 'true' : 'false',
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
                  {z(title)}
                </Tab>
              );
            })}
          </ResponsiveTabs>
        )}

        <section
          className={`${sectionTestClassName} ${
            isEmbedded && 'pb-5'
          } flex flex-col max-w-[980px] mt-5`}
        >
          {tabName === 'income' && !isEmbedded ? (
            <>
              <div className="flex items-center pb-3 mt-1 text-pink-600 group">
                <BackLink
                  href={`https://www.moneyhelper.org.uk/${locale}/everyday-money/budgeting/budget-planner`}
                >
                  {z({ en: 'Back', cy: 'Yn ôl' })}
                </BackLink>
              </div>
              <Heading
                level="h1"
                className="pb-6 md:pb-10 md:pt-4 text-blue-800 text-[34px] md:text-[56px]"
              >
                {tabTitle}
              </Heading>
            </>
          ) : (
            <Heading
              level="h1"
              id={tabName ?? ''}
              className="pb-6 md:pb-10 md:pt-4 text-blue-800 text-[34px] md:text-[56px]"
            >
              {tabTitle}
            </Heading>
          )}
          {children}
        </section>
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

  try {
    return {
      props: {
        data,
        tabName: params?.tabName || null,
        isEmbedded: isEmbed,
        fullUrl,
        query,
        sessionID: query.sessionID ? String(query.sessionID) : null,
      },
    };
  } catch (error) {
    console.error('There has been an error', { error });
    return {
      props: {
        query,
        sessionID: query.sessionID ? String(query.sessionID) : null,
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
      destination: `/${language}/budget-planner/${tab.name}?${search}`,
    },
  };
};
