import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ClaimingYourStatePension } from '../../../components/ClaimingYourStatePension';
import { PensionDetailStatePensionAccordion } from '../../../components/PensionDetailStatePensionAccordion';
import { PensionDetailStatePensionIntro } from '../../../components/PensionDetailStatePensionIntro';
import { PensionDetailStatePensionTable } from '../../../components/PensionDetailStatePensionTable';
import { StatePensionEstimatedIncome } from '../../../components/StatePensionEstimatedIncome';
import { StatePensionMessage } from '../../../components/StatePensionMessage';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { BACK_LINKS } from '../../../lib/constants';
import { getPensionDetail } from '../../../lib/fetch';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../lib/types';
import {
  getDashboardChannel,
  getUserSessionFromCookies,
  storeCurrentUrl,
} from '../../../lib/utils';

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

  const narrowColClasses = 'xl:col-span-8 2xl:col-span-7';

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={t('pages.pension-details.state-pension')}
      helpAndSupport
      isOffset={false}
    >
      <div className={'xl:grid xl:grid-cols-12'}>
        <div className={narrowColClasses}>
          <PensionDetailStatePensionIntro data={data} />
          <PensionDetailStatePensionAccordion data={data} />
        </div>

        <div className="col-span-10">
          <PensionDetailStatePensionTable data={data} />
        </div>

        <div className={narrowColClasses}>
          <StatePensionEstimatedIncome data={data} />
          <StatePensionMessage data={data} locale={locale} />
          <ClaimingYourStatePension />
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);

  // Get pension ID from cookie instead of route parameter
  const id = cookies.get('pensionId');

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
