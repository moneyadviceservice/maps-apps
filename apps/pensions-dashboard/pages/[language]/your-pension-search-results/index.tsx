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
  numberToWords,
  setDashboardChannel,
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

  const title = t('pages.your-pension-search-results.title');
  const seoTitle = t('pages.your-pension-search-results.page-title');
  const allGreenPensions = [...greenPensions, ...greenPensionsNoIncome];

  const pensionsHeading =
    totalPensions === 1
      ? t('pages.your-pension-search-results.heading-single', {
          totalPensions: `${numberToWords(totalPensions, locale)}`,
        })
      : t('pages.your-pension-search-results.heading', {
          totalPensions: `${numberToWords(totalPensions, locale)}`,
        });

  return (
    <PensionsDashboardLayout seoTitle={seoTitle} title={title} helpAndSupport>
      <div className="xl:grid xl:grid-cols-10 xl:gap-4">
        <div className="xl:col-span-8 2xl:col-span-7">
          {totalPensions > 0 && (
            <Heading
              data-testid="pensions-found"
              level="h2"
              className="mb-6 md:mb-12 md:text-5xl"
            >
              {pensionsHeading}
            </Heading>
          )}

          {allGreenPensions.length > 0 && (
            <ChannelCallout
              data={allGreenPensions}
              title={t(
                'pages.your-pension-search-results.channels.confirmed.title',
              )}
              icon={IconType.TICK_GREEN}
              link="/your-pension-breakdown"
              linkText={t(
                'pages.your-pension-search-results.channels.confirmed.cta',
              )}
              variant={CalloutVariant.POSITIVE}
            />
          )}

          {yellowPensions.length > 0 && (
            <ChannelCallout
              data={yellowPensions}
              title={t(
                'pages.your-pension-search-results.channels.incomplete.title',
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
          )}

          {redPensions.length > 0 && (
            <ChannelCallout
              data={redPensions}
              title={t(
                'pages.your-pension-search-results.channels.unconfirmed.title',
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
          )}

          <Link
            href={`/${locale}/pensions-not-showing`}
            className="items-start md:mt-2"
          >
            {t(
              'pages.your-pension-search-results.common-links.pensions-not-showing',
            )}
            <Icon
              type={IconType.CHEVRON_RIGHT}
              className="w-[11px] [&_path]:fill-pink-600 mt-2 ml-1 md:hidden"
            />
          </Link>

          {unsupportedPensions.length > 0 && (
            <UrgentCallout
              testId="unsupported-callout"
              variant="arrow"
              border="teal"
              className="mt-12"
            >
              <p className="mb-6 text-4xl font-bold leading-10">
                Unsupported pensions found
              </p>
              <p>
                We found one or more pensions that could belong to you that we
                can’t display yet. We’re still building and improving our
                service, so check back again soon.
              </p>
            </UrgentCallout>
          )}
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);

  storeCurrentUrl(context);
  setDashboardChannel(context, 'NONE');

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
    console.error('Error fetching all pensions:', error);
    return { notFound: true };
  }
};
