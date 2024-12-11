import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionDetailIntro } from '../../../../components/PensionDetailIntro';
import { PensionDetailMoreInfo } from '../../../../components/PensionDetailMoreInfo';
import { PensionDetailsSection } from '../../../../components/PensionDetailsSection';
import { PensionProviderSection } from '../../../../components/PensionProviderSection';
import { StatePensionMessage } from '../../../../components/StatePensionMessage';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { BACK_LINKS, IllustrationType } from '../../../../lib/constants';
import { getPensionDetail } from '../../../../lib/fetch';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../../lib/types';
import {
  getDashboardChannel,
  getLatestIllustration,
  getUserSessionFromCookies,
  storeCurrentUrl,
} from '../../../../lib/utils';

type Props = {
  id: string;
  backLink: string;
  data: PensionArrangement;
  component?: BenefitIllustrationComponent;
  hasPayableDetails: boolean;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  data,
  component,
  hasPayableDetails,
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pension-details.title', { name: data.schemeName });

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={title}
      helpAndSupport
    >
      <>
        <PensionDetailIntro data={data} benefitIllustration={component} />
        <StatePensionMessage data={data} locale={locale} />
        <PensionDetailMoreInfo data={data} />
        <PensionDetailsSection
          data={data}
          hasPayableDetails={hasPayableDetails}
        />
        <PensionProviderSection data={data} />
      </>
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

    const component = getLatestIllustration(IllustrationType.ERI, data);

    const hasPayableDetails = () =>
      data.benefitIllustrations?.some(({ illustrationComponents }) =>
        illustrationComponents.some(({ payableDetails }) => payableDetails),
      );

    return {
      props: {
        id,
        data,
        component,
        hasPayableDetails: hasPayableDetails(),
        backLink: BACK_LINKS[channel ?? ''],
      },
    };
  } catch (error) {
    console.error('Error fetching pension detail:', error);
    return { notFound: true };
  }
};
