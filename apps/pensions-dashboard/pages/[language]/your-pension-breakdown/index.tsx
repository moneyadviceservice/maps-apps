import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { ConfirmedPensionsCallout } from '../../../components/ConfirmedPensionsCallout';
import { ScamWarning } from '../../../components/ScamWarning';
import { SummaryCallout } from '../../../components/SummaryCallout/SummaryCallout';
import { UnconfirmedPensionsCallout } from '../../../components/UnconfirmedPensionsCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getAllPensions } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import {
  getPensionTotals,
  getUserSessionFromCookies,
  setDashboardChannel,
  storeCurrentUrl,
  Totals,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
  unconfirmedPensions: PensionArrangement[];
  totals: Totals;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  unconfirmedPensions,
  totals,
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
      <Heading level="h2" className="mb-4">
        {t('pages.your-pension-breakdown.heading')}
      </Heading>

      <div className="md:max-w-4xl">
        <Paragraph>{t('pages.your-pension-breakdown.description')}</Paragraph>

        <SummaryCallout totals={totals} />

        <ExpandableSection
          variant="mainLeftIcon"
          title="Text description for chart image"
        >
          Charts go here
        </ExpandableSection>
      </div>

      <Heading level="h2" className="mt-12 mb-8">
        {t('pages.your-pension-breakdown.confirmed-pensions.heading')}
      </Heading>

      <ul
        data-testid="confirmed-pensions"
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
      >
        {data.map((arrangement) => (
          <li key={arrangement.externalAssetId} className="col-span-1">
            <ConfirmedPensionsCallout data={arrangement} />
          </li>
        ))}
      </ul>

      {unconfirmedPensions && (
        <UnconfirmedPensionsCallout data={unconfirmedPensions} />
      )}

      <ScamWarning
        title={t('pages.your-pension-breakdown.scam-warning.heading')}
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
    if (!data?.confirmedPensions) {
      return { notFound: true };
    }

    const { confirmedPensions, unconfirmedPensions } = data;
    const totals = getPensionTotals(confirmedPensions);

    return {
      props: {
        data: confirmedPensions,
        unconfirmedPensions,
        totals,
      },
    };
  } catch (error) {
    console.error('Error fetching confirmed pensions:', error);
    return { notFound: true };
  }
};
