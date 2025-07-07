import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionsCard } from '../../../components/PensionsCard';
import { ScamWarning } from '../../../components/ScamWarning';
import { UnconfirmedPensionsCallout } from '../../../components/UnconfirmedPensionsCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { PensionsCardType } from '../../../lib/constants';
import { getAllPensions } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import {
  getUserSessionFromCookies,
  setDashboardChannel,
  storeCurrentUrl,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
  dataNoIncome: PensionArrangement[];
  redPensions: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  dataNoIncome,
  redPensions,
}) => {
  const { t, tList, locale } = useTranslation();
  const seoTitle = t('pages.your-pension-breakdown.page-title');
  const title = t('pages.your-pension-breakdown.title');
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
    >
      {data.length > 0 && (
        <>
          <Heading level="h2" className="mb-6 md:mb-7 md:text-5xl">
            {t('pages.your-pension-breakdown.confirmed-pensions.heading')}
          </Heading>

          <ul
            data-testid="confirmed-pensions"
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            {data.map((arrangement) => (
              <li key={arrangement.externalAssetId} className="col-span-1">
                <PensionsCard data={arrangement} />
              </li>
            ))}
          </ul>

          <div className="mt-6 md:mt-10 xl:grid xl:grid-cols-10 xl:gap-4">
            <div className="xl:col-span-8 2xl:col-span-7">
              <ExpandableSection
                variant="mainLeftIcon"
                title={t(
                  'pages.your-pension-breakdown.confirmed-pensions.accordion-title',
                )}
                contentTestClassName="mt-0 leading-[1.6]"
              >
                {t(
                  'pages.your-pension-breakdown.confirmed-pensions.accordion-content',
                )}
              </ExpandableSection>
            </div>
          </div>
        </>
      )}

      {dataNoIncome.length > 0 && (
        <>
          <Heading level="h2" className="mt-6 mb-6 md:mb-7 md:text-5xl">
            {t(
              'pages.your-pension-breakdown.confirmed-pensions-no-income.heading',
            )}
          </Heading>

          <ul
            data-testid="confirmed-pensions-no-income"
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
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

          <div className="mt-10 xl:grid xl:grid-cols-10 xl:gap-4">
            <div className="xl:col-span-8 2xl:col-span-7">
              <ExpandableSection
                variant="mainLeftIcon"
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

      <div className="md:mt-10 xl:grid xl:grid-cols-10 xl:gap-4">
        <div className="xl:col-span-8 2xl:col-span-7">
          {redPensions && <UnconfirmedPensionsCallout data={redPensions} />}

          <ScamWarning
            title={t('pages.your-pension-breakdown.scam-warning.heading')}
            className={redPensions ? 'md:mt-20' : 'md:mt-10'}
          >
            {scamWarningItems.map((item: string) => (
              <Markdown key={item.slice(0, 8)} content={item} />
            ))}

            <Heading level="h6" className="mt-8 mb-4">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);

  storeCurrentUrl(context);
  setDashboardChannel(context, 'CONFIRMED');

  try {
    const data = await getAllPensions(userSession);

    // If there is no data or no confirmed pensions, return 404 page
    if (!data?.greenPensions) {
      return { notFound: true };
    }

    const { greenPensions, redPensions, greenPensionsNoIncome } = data;

    return {
      props: {
        data: greenPensions,
        dataNoIncome: greenPensionsNoIncome,
        redPensions,
      },
    };
  } catch (error) {
    console.error('Error fetching confirmed pensions:', error);
    return { notFound: true };
  }
};
