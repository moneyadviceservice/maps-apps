import { GetServerSideProps, NextPage } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ClaimingYourStatePension } from '../../../components/ClaimingYourStatePension';
import { PensionDetailStatePensionAccordion } from '../../../components/PensionDetailStatePensionAccordion';
import { PensionDetailStatePensionIntro } from '../../../components/PensionDetailStatePensionIntro';
import { StatePensionEstimatedIncome } from '../../../components/StatePensionEstimatedIncome';
import { StatePensionMessage } from '../../../components/StatePensionMessage';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getPensionDetailById } from '../../../lib/api/pension-data-service';
import { BACK_LINKS } from '../../../lib/constants';
import { useMHPDAnalytics } from '../../../lib/hooks';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../lib/types';
import {
  Cookies,
  getDashboardChannel,
  getMhpdSessionConfig,
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';

type PageProps = {
  id: string;
  backLink: string;
  data: PensionArrangement;
  component?: BenefitIllustrationComponent;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.pension-details.state-pension';

  // Track analytics for this page
  useMHPDAnalytics({
    eventName: 'pensionSearchResults',
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={t('pages.pension-details.state-pension')}
      helpAndSupport
      isOffset={false}
    >
      <div className="xl:grid xl:grid-cols-12">
        <div className="xl:col-span-8 2xl:col-span-7">
          <PensionDetailStatePensionIntro data={data} />
          <PensionDetailStatePensionAccordion data={data} />
          <StatePensionEstimatedIncome data={data} />
          <StatePensionMessage data={data} locale={locale} />
          <ClaimingYourStatePension />
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

    // Get pension ID from session config instead of individual cookie
    const { pensionID: id } = getMhpdSessionConfig(cookies);

    if (!id) {
      return { notFound: true };
    }

    storeCurrentUrl(context);
    const { channel } = getDashboardChannel(context);

    try {
      const data = await getPensionDetailById(id, { userSession });

      if (!data) {
        return { notFound: true };
      }

      return {
        props: {
          id,
          data,
          backLink: BACK_LINKS[channel ?? ''],
        },
      };
    } catch (error) {
      return handlePageError(error, language, 'Error fetching pension detail:');
    }
  },
);
