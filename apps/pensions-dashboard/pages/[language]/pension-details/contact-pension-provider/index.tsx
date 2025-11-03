import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionDetailContact } from '../../../../components/PensionDetailContact';
import { PensionDetailHeader } from '../../../../components/PensionDetailHeader';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { getPensionDetailById } from '../../../../lib/api/pension-data-service';
import { BACK_LINKS } from '../../../../lib/constants';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../../lib/types';
import {
  getDashboardChannel,
  getMhpdSessionConfig,
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
} from '../../../../lib/utils/system';

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

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={data.schemeName}
      isOffset={false}
      helpAndSupport
      seoTitle={t('pages.pension-details.contact-page-title')}
      showTabsNavigation={true}
    >
      <PensionDetailHeader data={data} />
      <PensionDetailContact data={data} />
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);
  const language = context.query.language as string;
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
