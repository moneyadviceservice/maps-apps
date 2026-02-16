import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';
import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionsCard } from '../../../components/PensionsCard';
import { ScamWarning } from '../../../components/ScamWarning';
import { SummarySentence } from '../../../components/SummarySentence';
import { UnconfirmedPensionsCallout } from '../../../components/UnconfirmedPensionsCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getPensionsByCategory } from '../../../lib/api/pension-data-service';
import { PensionsCardType, PensionsCategory } from '../../../lib/constants';
import { useMHPDAnalytics } from '../../../lib/hooks/useMHPDAnalytics';
import { CardData, PensionArrangement, SummaryData } from '../../../lib/types';
import { splitConfirmedPensions } from '../../../lib/utils/data';
import {
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';

type PageProps = {
  data: (PensionArrangement & { cardData?: CardData })[];
  dataNoIncome: PensionArrangement[];
  redPensions: number;
  summaryData: SummaryData | undefined;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  dataNoIncome,
  redPensions,
  summaryData,
}) => {
  const { t, tList, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.your-pension-breakdown.page-title';
  const seoTitle = t(titleKey);
  const title = t('pages.your-pension-breakdown.title');

  // Track analytics for this page
  useMHPDAnalytics({
    eventName: 'pensionSearchResults',
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  const scamWarningItems = tList(
    'pages.your-pension-breakdown.scam-warning.description.items',
  );
  const scamWarningActions = tList(
    'pages.your-pension-breakdown.scam-warning.action.items',
  );

  return (
    <PensionsDashboardLayout
      seoTitle={seoTitle}
      title={title}
      back={`/${locale}/your-pension-search-results`}
      helpAndSupport
      isOffset={false}
    >
      {data.length > 0 && (
        <>
          <SummarySentence data={summaryData} />

          <Heading level="h2" className="mb-7 md:mb-3 md:text-5xl">
            {t('pages.your-pension-breakdown.confirmed-pensions.heading')} (
            {data.length})
          </Heading>

          {dataNoIncome.length > 0 && (
            <Markdown
              content={t(
                'pages.your-pension-breakdown.confirmed-pensions.no-income-link',
              )}
            />
          )}

          <ul
            data-testid="confirmed-pensions"
            className="grid grid-cols-1 gap-6 mt-6 md:mt-14 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            {data.map((arrangement) => (
              <li key={arrangement.externalAssetId} className="col-span-1">
                <PensionsCard data={arrangement} />
              </li>
            ))}
          </ul>
        </>
      )}

      {dataNoIncome.length > 0 && (
        <>
          <Heading
            level="h2"
            className={twMerge(
              'mt-6 mb-7 md:mb-3 md:text-5xl',
              data.length > 0 && 'mt-28',
            )}
            id="no-income"
            tabIndex={-1}
          >
            {data.length > 0
              ? t(
                  'pages.your-pension-breakdown.confirmed-pensions-no-income.heading',
                )
              : t(
                  'pages.your-pension-breakdown.confirmed-pensions-no-income.heading-no-pensions-with-income',
                )}{' '}
            ({dataNoIncome.length})
          </Heading>

          <ul
            data-testid="confirmed-pensions-no-income"
            className="grid grid-cols-1 gap-6 mt-6 md:mt-12 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            {dataNoIncome.map((arrangement) => (
              <li key={arrangement.externalAssetId} className="col-span-1">
                <PensionsCard
                  data={arrangement}
                  type={PensionsCardType.CONFIRMED_NO_INCOME}
                />
              </li>
            ))}
          </ul>

          <div className="mt-4 md:mt-8 xl:grid xl:grid-cols-12 xl:gap-8">
            <div className="xl:col-span-8">
              <ExpandableSection
                variant="hyperlink"
                title={t(
                  'pages.your-pension-breakdown.confirmed-pensions-no-income.accordion-title',
                )}
                contentTestClassName="mt-0 leading-[1.6]"
              >
                <Markdown
                  content={t(
                    'pages.your-pension-breakdown.confirmed-pensions-no-income.accordion-content',
                  )}
                />
              </ExpandableSection>
            </div>
          </div>
        </>
      )}

      <div className="md:mt-6 xl:grid xl:grid-cols-12 xl:gap-8">
        <div className="xl:col-span-8">
          {redPensions > 0 && (
            <UnconfirmedPensionsCallout count={redPensions} />
          )}

          <ScamWarning
            title={t('pages.your-pension-breakdown.scam-warning.heading')}
            className="md:mt-8"
          >
            {scamWarningItems.map((item: string) => (
              <Markdown key={item.slice(0, 8)} content={item} />
            ))}

            <Heading level="h6" component="h4" className="mt-8 mb-2">
              {t('pages.your-pension-breakdown.scam-warning.action.heading')}
            </Heading>

            <ListElement
              items={scamWarningActions.map((item: string) => (
                <Markdown key={item.slice(0, 8)} content={item} />
              ))}
              variant="unordered"
              color="dark"
              className="ml-8"
            />
          </ScamWarning>
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const cookies = new Cookies(context.req, context.res);
    const userSession = getUserSessionFromCookies(cookies);
    const language = context.query.language as string;

    storeCurrentUrl(context, 'CONFIRMED');

    try {
      const data = await getPensionsByCategory(PensionsCategory.CONFIRMED, {
        userSession,
      });

      if (!data) {
        return { notFound: true };
      }

      const { greenPensions, greenPensionsNoIncome } = splitConfirmedPensions(
        data.arrangements,
      );

      // If there is no data or no confirmed pensions, return 404 page
      if (
        !data?.arrangements ||
        (greenPensions.length === 0 && greenPensionsNoIncome.length === 0)
      ) {
        return { notFound: true };
      }

      return {
        props: {
          data: greenPensions,
          dataNoIncome: greenPensionsNoIncome,
          redPensions: data.totalContactPensions || 0,
          summaryData: data.summaryData || null,
        },
      };
    } catch (error) {
      return handlePageError(
        error,
        language,
        'Error fetching confirmed pensions:',
      );
    }
  },
);
