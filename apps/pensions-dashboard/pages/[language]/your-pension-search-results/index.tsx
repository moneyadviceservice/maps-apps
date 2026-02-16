import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';

import { ChannelCallout } from '../../../components/ChannelCallout';
import { ErrorPensionsCallout } from '../../../components/ErrorPensionsCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import {
  getPensionsAnalytics,
  getPensionsSummary,
  PensionsAnalytics,
  PensionsSummaryArrangement,
} from '../../../lib/api/pension-data-service';
import { PensionsCategory } from '../../../lib/constants';
import { useMHPDAnalytics } from '../../../lib/hooks';
import { sortPensions, splitConfirmedPensions } from '../../../lib/utils/data';
import {
  getMhpdSessionConfig,
  getUserSessionFromCookies,
  handlePageError,
  setMhpdSessionConfig,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';

type Props = {
  hasPensions: boolean;
  totalPensions: number;
  yellowPensions: PensionsSummaryArrangement[];
  greenPensions: PensionsSummaryArrangement[];
  redPensions: PensionsSummaryArrangement[];
  greenPensionsNoIncome: PensionsSummaryArrangement[];
  showUnsupportedCallout: boolean;
  errorPensions: PensionsSummaryArrangement[];
  analyticsData: PensionsAnalytics | null;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  totalPensions,
  yellowPensions,
  greenPensions,
  redPensions,
  greenPensionsNoIncome,
  showUnsupportedCallout,
  errorPensions,
  analyticsData,
}) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.your-pension-search-results.page-title';
  const seoTitle = t(titleKey);
  const title = t('pages.your-pension-search-results.title');

  // Track analytics for this page (always fires, searchResults only included when fetched)
  useMHPDAnalytics({
    eventName: 'pensionSearchResults',
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
    ...(analyticsData && { searchResults: analyticsData }),
  });

  const allGreenPensions = [...greenPensions, ...greenPensionsNoIncome];

  const pensionsHeading =
    totalPensions === 1
      ? t('pages.your-pension-search-results.heading-single')
      : t('pages.your-pension-search-results.heading', {
          totalPensions: `${totalPensions}`,
        });

  // Count how many callouts have items
  const calloutCount = [allGreenPensions, yellowPensions, redPensions].filter(
    (arr) => arr.length > 0,
  ).length;

  // Render layout based on count
  const columnClasses =
    calloutCount === 1
      ? 'lg:col-span-8'
      : calloutCount === 2
      ? 'lg:col-span-6'
      : 'lg:col-span-4';

  return (
    <PensionsDashboardLayout
      seoTitle={seoTitle}
      title={title}
      helpAndSupport
      isOffset={false}
    >
      {totalPensions > 0 && (
        <Heading
          data-testid="pensions-found"
          level="h2"
          className="mb-6 md:mb-14 md:text-5xl"
        >
          {pensionsHeading}
        </Heading>
      )}

      <div className="lg:grid lg:grid-cols-12 lg:gap-6">
        {allGreenPensions.length > 0 && (
          <div className={columnClasses}>
            <ChannelCallout
              data={allGreenPensions}
              title={t(
                'pages.your-pension-search-results.channels.confirmed.title',
                {
                  confirmedPensions: `${allGreenPensions.length}`,
                },
              )}
              icon={IconType.TICK_GREEN}
              link="/your-pension-breakdown"
              linkText={t(
                'pages.your-pension-search-results.channels.confirmed.cta',
              )}
              variant={CalloutVariant.POSITIVE}
            />
          </div>
        )}

        {yellowPensions.length > 0 && (
          <div className={columnClasses}>
            <ChannelCallout
              data={yellowPensions}
              title={t(
                'pages.your-pension-search-results.channels.incomplete.title',
                {
                  incompletePensions: `${yellowPensions.length}`,
                },
              )}
              description={t(
                'pages.your-pension-search-results.channels.incomplete.sub-title',
              )}
              icon={IconType.CLOCK}
              link="/pending-pensions"
              linkText={t(
                'pages.your-pension-search-results.channels.incomplete.cta',
              )}
              variant={CalloutVariant.WARNING}
            />
          </div>
        )}

        {redPensions.length > 0 && (
          <div className={columnClasses}>
            <ChannelCallout
              data={redPensions}
              title={t(
                'pages.your-pension-search-results.channels.unconfirmed.title',
                { unconfirmedPensions: `${redPensions.length}` },
              )}
              description={t(
                'pages.your-pension-search-results.channels.unconfirmed.sub-title',
              )}
              icon={IconType.WARNING_SQUARE}
              iconClasses="fill-red-700"
              link="/pensions-that-need-action"
              linkText={t(
                'pages.your-pension-search-results.channels.unconfirmed.cta',
              )}
              variant={CalloutVariant.NEGATIVE}
            />
          </div>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          {showUnsupportedCallout && (
            <UrgentCallout
              testId="unsupported-callout"
              variant="arrow"
              border="teal"
              className="mb-6 md:mb-10"
            >
              <p className="mb-5 text-xl font-bold leading-8 md:leading-10 md:text-4xl">
                {t(
                  'pages.your-pension-search-results.channels.unsupported.title',
                )}
              </p>
              <p className="leading-7 md:leading-10">
                {t(
                  'pages.your-pension-search-results.channels.unsupported.text',
                )}
              </p>
            </UrgentCallout>
          )}

          {errorPensions.length > 0 && (
            <ErrorPensionsCallout count={errorPensions.length} />
          )}

          <Link
            href={`/${locale}/pensions-not-showing`}
            className="items-start"
          >
            {t(
              'pages.your-pension-search-results.common-links.pensions-not-showing',
            )}
            <Icon
              type={IconType.CHEVRON_RIGHT}
              className="w-[11px] [&_path]:fill-magenta-500 mt-2 ml-1 md:hidden"
            />
          </Link>
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
    const sessionConfig = getMhpdSessionConfig(cookies);
    const language = context.query.language as string;

    storeCurrentUrl(context, 'NONE');

    try {
      // Get pensions analytics data (only once per session)
      let analyticsData;
      if (!sessionConfig.analyticsDataSent) {
        analyticsData = await getPensionsAnalytics({
          userSession,
        });

        setMhpdSessionConfig(cookies, { analyticsDataSent: true });
      }

      const data = await getPensionsSummary({
        userSession,
      });

      if (!data) {
        return { notFound: true };
      }

      const { totalPensionsFound, pensions } = data;

      if (!pensions?.length) {
        return {
          redirect: {
            destination: './no-pensions-found',
            permanent: false,
          },
        };
      }

      const unsupported = [];
      const pending = [];
      const contact = [];
      const confirmed = [];
      const error = [];

      for (const pension of pensions) {
        switch (pension.category) {
          case PensionsCategory.UNSUPPORTED:
            unsupported.push(pension);
            break;
          case PensionsCategory.PENDING:
            pending.push(pension);
            break;
          case PensionsCategory.CONTACT:
            contact.push(pension);
            break;
          case PensionsCategory.CONFIRMED:
            confirmed.push(pension);
            break;
          case PensionsCategory.ERROR:
            error.push(pension);
            break;
        }
      }

      const yellowPensions = sortPensions(pending);
      const redPensions = sortPensions(contact);
      const { greenPensions, greenPensionsNoIncome } =
        splitConfirmedPensions(confirmed);

      return {
        props: {
          totalPensions: totalPensionsFound,
          greenPensions,
          greenPensionsNoIncome,
          yellowPensions,
          redPensions,
          showUnsupportedCallout: unsupported.length > 0,
          errorPensions: error,
          analyticsData: analyticsData || null,
        },
      };
    } catch (error) {
      return handlePageError(error, language, 'Error fetching all pensions:');
    }
  },
);
