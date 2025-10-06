import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionDetailHeader } from '../../../../components/PensionDetailHeader';
import { PensionDetailIllustrationDate } from '../../../../components/PensionDetailIllustrationDate';
import { PensionDetailSummary } from '../../../../components/PensionDetailSummary';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { BACK_LINKS } from '../../../../lib/constants';
import { getPensionDetail } from '../../../../lib/fetch';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../../lib/types';
import {
  getDashboardChannel,
  getMhpdSessionConfig,
  getUserSessionFromCookies,
  handlePageError,
  processBenefitIllustrations,
  storeCurrentUrl,
} from '../../../../lib/utils';

type PageProps = {
  backLink: string;
  data: PensionArrangement;
  component?: BenefitIllustrationComponent;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const { unavailableCode } =
    processBenefitIllustrations(data.benefitIllustrations) ?? '';

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={data.schemeName}
      helpAndSupport
      isOffset={false}
      seoTitle={t('pages.pension-details.summary-page-title')}
      showTabsNavigation={true}
    >
      <PensionDetailHeader data={data} />
      <PensionDetailSummary data={data} unavailableCode={unavailableCode} />
      <PensionDetailIllustrationDate data={data} />
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    const data = await getPensionDetail(id, userSession);

    if (!data) {
      return { notFound: true };
    }

    const isRedPension = data.group === 'red';
    const backLink = isRedPension
      ? `/pensions-that-need-action`
      : BACK_LINKS[channel ?? ''];

    return {
      props: {
        data,
        backLink,
      },
    };
  } catch (error) {
    return handlePageError(error, language, 'Error fetching pension detail:');
  }
};
