import { useEffect } from 'react';

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
  PreviewData,
} from 'next';
import { useRouter } from 'next/router';

import { useBudgetPlannerProvider } from 'context/BudgetPlannerDataProvider';
import { saveAndContinuePageContent as content } from 'data/budget-planner';
import { ParsedUrlQuery } from 'querystring';
import { fetchDataFromCache } from 'utils/cacheInMemory/cacheInMemory';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BudgetPlannerPageWrapper } from '.';

export interface SaveDataProps {
  data: {
    [key: string]: Record<string, string>;
  };
  error?: string[];
  tabName: string;
  language: string;
  tool: string;
  isEmbedded: boolean;
  sessionID: string;
  ckey?: string;
}

interface SaveApiResponse {
  message?: string;
  data?: { [key: string]: Record<string, string> };
  cause?: 'email' | 'database';
  sessionID?: string;
}

const Page: NextPage<SaveDataProps> = ({
  data,
  error,
  tabName,
  language,
  tool,
  isEmbedded,
  sessionID,
  ckey,
}: SaveDataProps) => {
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();
  const router = useRouter();
  tabName = tabName || (router.query.tabName as string);

  language = language || (router.query.language as string);

  isEmbedded = !!isEmbedded || router.query.isEmbedded === 'true' || false;

  const { dataInContext, setDataInContext } = useBudgetPlannerProvider();

  const userData = Object.keys(dataInContext).length > 0 ? dataInContext : data;

  const pageData = {
    event: 'pageLoadReact',
    page: {
      pageName: 'budget-planner--save-and-come-back-later',
      pageTitle: z({
        en: 'Budget Planner - MoneyHelper Tools',
        cy: 'Cynlluniwr Cyllideb - Teclynnau HelpwrArian',
      }),
      categoryLevels: ['Everyday money', 'Budgeting'],
    },
    tool: {
      toolName: 'Budget Planner',
    },
  };

  const handleSaveAndReturn = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const { email } = e.currentTarget.form as HTMLFormElement;

    try {
      const response = await sendSaveAndReturnRequest(email.value);
      const json = await response.json();

      if (json.data) {
        setDataInContext(json.data);
      }

      handleDatabaseError(json);
      handleApiResponse(response, json);
    } catch (error) {
      handleError(error);
    }
  };

  const sendSaveAndReturnRequest = (emailValue: string) => {
    return fetch(
      `/api/budget-planner/save-and-return?isJsonRes=true&sessionID=${sessionID}&isEmbedded=${isEmbedded}`,
      {
        method: 'POST',
        body: JSON.stringify({
          userData,
          email: emailValue,
          language,
          tool,
          tabName,
          isEmbedded,
        }),
      },
    );
  };

  const handleDatabaseError = (json: SaveApiResponse) => {
    if (json.cause === 'database') {
      router.push({
        pathname: `/${language}/${tool}/error-page`,
        query: {
          ...router.query,
          isEmbedded: isEmbedded ? 'true' : 'false',
        },
      });
    }
  };

  const handleApiResponse = (response: Response, json: SaveApiResponse) => {
    const { sessionID: responseSessionID } = json;
    const baseParams = {
      tabName,
      isEmbedded: isEmbedded ? 'true' : 'false',
    };

    if (response.status === 200) {
      redirectToSuccessPage(responseSessionID, baseParams);
    } else {
      redirectToErrorPage(responseSessionID, json.cause ?? '', baseParams);
    }
  };

  const redirectToSuccessPage = (
    responseSessionID: string | undefined,
    baseParams: Record<string, string>,
  ) => {
    const params = new URLSearchParams(baseParams);
    if (responseSessionID) params.set('sessionID', responseSessionID);
    router.push(`/${language}/${tool}/progress-saved?${params}`);
  };

  const redirectToErrorPage = (
    responseSessionID: string | undefined,
    errorCause: string,
    baseParams: Record<string, string>,
  ) => {
    const params = new URLSearchParams({
      ...baseParams,
      error: errorCause,
    });
    if (responseSessionID) params.set('sessionID', responseSessionID);
    router.push(`/${language}/${tool}/save?${params}`);
  };

  const handleError = (error: unknown) => {
    const er =
      error && (error as { cause?: string }).cause
        ? (error as { cause?: string }).cause
        : '';
    router.push(`/${language}/${tool}/save?tabName=${tabName}&error=${er}`);
  };

  const errorData: AnalyticsData = {
    event: 'errorMessage',
    eventInfo: {
      toolName: 'Budget Planner',
      toolStep: '',
      stepName: '',
      errorDetails: [
        {
          reactCompType: 'TextInput',
          reactCompName: 'Your email address',
          errorMessage:
            'Error: Enter an email address in the correct format, like name@example.com',
        },
      ],
    },
    page: {},
    tool: {},
  };
  useEffect(() => {
    addEvent(pageData);

    if (error && (error[0] === 'email' || error[0] === 'true')) {
      addEvent(errorData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <BudgetPlannerPageWrapper
      title={z({ en: 'Budget Planner', cy: 'Cynlluniwr Cyllideb' })}
      isEmbedded={isEmbedded}
    >
      <div className={`${isEmbedded && 'pb-2'} max-w-[840px] mb-16`}>
        <Link
          href={{
            pathname: `/${language}/${tool}/${tabName}`,
            query: {
              isEmbedded: isEmbedded,
              ckey: ckey,
            },
          }}
        >
          <Icon type={IconType.CHEVRON_LEFT} />
          {z({ en: 'Back', cy: 'Yn ôl' })}
        </Link>
        <H1 className="my-8">{z(content.title)}</H1>
        <p className="mb-8">{z(content.subHeading)}</p>
        <form method="POST" noValidate className="mb-8 space-y-6 max-w-[495px]">
          <input
            type="hidden"
            name={'userData'}
            value={JSON.stringify(userData)}
          />
          <input type="hidden" name={'tabName'} value={tabName} />
          <input type="hidden" name={'language'} value={language} />
          <input
            type="hidden"
            name={'isEmbedded'}
            value={isEmbedded ? 'true' : ''}
          />
          <input type="hidden" name={'tool'} value={tool} />
          <Errors errors={error ?? []}>
            <label className="block mb-1 text-lg" htmlFor="email">
              {z(content.inputLabel)}
            </label>
            <p id="email-hint" className="mb-1 text-gray-400">
              {z(content.inputHint)}
            </p>
            {error && error[0] === 'email' && (
              <p id="email-error" className="mb-1 text-red-700">
                Error: {z(content.errorMessage)}
              </p>
            )}

            <input
              className={`${
                error && error[0] === 'email'
                  ? 'border-red-700'
                  : 'border-gray-400'
              } border rounded focus:outline-purple-700 focus:shadow-focus-outline h-10 m-px mt-1 px-3 w-full md:w-80`}
              id="email"
              name="email"
              type="email"
              aria-describedby={`email-hint ${
                error && error[0] === 'email' ? 'email-error' : ''
              }`}
            />
          </Errors>

          <Button
            className="w-full mt-8 md:w-auto"
            formAction={content.action}
            data-testid="save-and-return"
            onClick={handleSaveAndReturn}
          >
            {z({ en: 'Save and send email', cy: 'Arbed ac anfon e-bost' })}
          </Button>
        </form>
      </div>
    </BudgetPlannerPageWrapper>
  );
};

export default Page;
export const getSavePageServerSideProps: GetServerSideProps<
  SaveDataProps
> = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
): Promise<{ props: SaveDataProps }> => {
  const { query } = context;
  const { error, tabName, ckey } = query;

  return {
    props: {
      data: await fetchDataFromCache(`budget-planner_${query.ckey}`),
      error: error ? (Array.isArray(error) ? error : [error]) : [],
      tabName: tabName ? (Array.isArray(tabName) ? tabName[0] : tabName) : '',
      language: query.language as string,
      tool: 'budget-planner',
      isEmbedded: query.isEmbedded === 'true',
      sessionID: (query.sessionID as string) || '',
      ckey: ckey ? ckey.toString() : '',
    },
  };
};

export const getServerSideProps = getSavePageServerSideProps;
