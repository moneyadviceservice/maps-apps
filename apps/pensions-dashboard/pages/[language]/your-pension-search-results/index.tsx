import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
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
  incompletePensions: PensionArrangement[];
  confirmedPensions: PensionArrangement[];
  unconfirmedPensions: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  totalPensions,
  incompletePensions,
  confirmedPensions,
  unconfirmedPensions,
}) => {
  const { t, locale } = useTranslation();

  const title = t('pages.your-pension-search-results.title');
  const seoTitle = t('pages.your-pension-search-results.page-title');

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
      <div className="grid grid-cols-3 gap-16">
        <div className="col-span-3 xl:col-span-2">
          <Heading data-testid="pensions-found" level="h2" className="mb-12">
            {pensionsHeading}
          </Heading>

          {confirmedPensions.length > 0 && (
            <ChannelCallout
              data={confirmedPensions}
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

          {incompletePensions.length > 0 && (
            <ChannelCallout
              data={incompletePensions}
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

          {unconfirmedPensions.length > 0 && (
            <ChannelCallout
              data={unconfirmedPensions}
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

          <div>
            <Link href={`/${locale}/pensions-not-showing`}>
              {t(
                'pages.your-pension-search-results.common-links.pensions-not-showing',
              )}
            </Link>
          </div>
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
      incompletePensions,
      confirmedPensions,
      unconfirmedPensions,
    } = data;

    // Redirect to no-pensions-found page if no pensions are found
    if (totalPensions === 0) {
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
        incompletePensions,
        confirmedPensions,
        unconfirmedPensions,
      },
    };
  } catch (error) {
    console.error('Error fetching all pensions:', error);
    return { notFound: true };
  }
};
