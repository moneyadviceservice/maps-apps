import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import useTranslation from '@maps-react/hooks/useTranslation';

import { DetailsPage } from '../../../../components/DetailsPage';
import { DetailsPageSP } from '../../../../components/DetailsPageSP';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { BACK_LINKS, PensionType } from '../../../../lib/constants';
import { getPensionDetail } from '../../../../lib/fetch';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../../lib/types';
import {
  getDashboardChannel,
  getUserSessionFromCookies,
  processBenefitIllustrations,
  storeCurrentUrl,
} from '../../../../lib/utils';

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
  const { unavailableCode } =
    processBenefitIllustrations(data.benefitIllustrations) ?? '';

  const title =
    data.pensionType === PensionType.SP
      ? t('pages.pension-details.state-pension')
      : t('pages.pension-details.title', { name: data.schemeName });

  const PensionDetails =
    data.pensionType === PensionType.SP ? DetailsPageSP : DetailsPage;

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={title}
      helpAndSupport
    >
      <PensionDetails data={data} unavailableCode={unavailableCode} />
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);
  const id = (context.params?.id as string) ?? '';

  storeCurrentUrl(context);
  const { channel } = getDashboardChannel(context);

  try {
    const data = await getPensionDetail(id, userSession);

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
    console.error('Error fetching pension detail:', error);
    return { notFound: true };
  }
};
