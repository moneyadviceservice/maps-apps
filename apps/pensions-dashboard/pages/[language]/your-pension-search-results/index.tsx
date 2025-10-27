import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';

import { ChannelCallout } from '../../../components/ChannelCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getPensionsOverview } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import {
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
} from '../../../lib/utils';

type Props = {
  hasPensions: boolean;
  totalPensions: number;
  yellowPensions: PensionArrangement[];
  greenPensions: PensionArrangement[];
  redPensions: PensionArrangement[];
  greenPensionsNoIncome: PensionArrangement[];
  unsupportedPensions: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  totalPensions,
  yellowPensions,
  greenPensions,
  redPensions,
  greenPensionsNoIncome,
  unsupportedPensions,
}) => {
  const { t, locale } = useTranslation();
  const seoTitle = t('pages.your-pension-search-results.page-title');
  const title = t('pages.your-pension-search-results.title');

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
          {unsupportedPensions.length > 0 && (
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);
  const language = context.query.language as string;

  storeCurrentUrl(context, 'NONE');

  try {
    const data = await getPensionsOverview(userSession);

    // If no data is returned, return 404 page
    if (!data) {
      return { notFound: true };
    }

    const {
      totalPensions,
      yellowPensions,
      greenPensions,
      redPensions,
      greenPensionsNoIncome,
      unsupportedPensions,
    } = data;

    // Redirect to no-pensions-found page if no pensions are found
    if (totalPensions + unsupportedPensions.length === 0) {
      return {
        redirect: {
          destination: './no-pensions-found',
          permanent: false, // Temporary redirect
        },
      };
    }

    return {
      props: {
        totalPensions,
        yellowPensions,
        greenPensions,
        redPensions,
        greenPensionsNoIncome,
        unsupportedPensions,
      },
    };
  } catch (error) {
    return handlePageError(error, language, 'Error fetching all pensions:');
  }
};
