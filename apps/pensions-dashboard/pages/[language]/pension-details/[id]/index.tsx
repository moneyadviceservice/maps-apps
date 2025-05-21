import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import useTranslation from '@maps-react/hooks/useTranslation';

import { AdditionalDataTable } from '../../../../components/AdditionalDataTable';
import { ClaimingYourStatePension } from '../../../../components/ClaimingYourStatePension';
import { OtherDetailsTable } from '../../../../components/OtherDetailsTable';
import { PensionDetailAccordions } from '../../../../components/PensionDetailAccordions';
import { PensionDetailIntro } from '../../../../components/PensionDetailIntro';
import { PensionDetailsContactTable } from '../../../../components/PensionDetailsContactTable';
import { PensionDetailsSection } from '../../../../components/PensionDetailsSection';
import { PensionStatus } from '../../../../components/PensionStatus';
import { PlanDetailsTable } from '../../../../components/PlanDetailsTable';
import { StatePensionMessage } from '../../../../components/StatePensionMessage';
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
  const title = t('pages.pension-details.title', { name: data.schemeName });

  const { unavailableCode } =
    processBenefitIllustrations(data.benefitIllustrations) ?? '';

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={title}
      helpAndSupport
    >
      <div className="xl:grid xl:grid-cols-10 xl:gap-4">
        <div className="xl:col-span-8 2xl:col-span-7">
          <PensionDetailIntro data={data} unavailableCode={unavailableCode} />
          <PensionStatus data={data} />
          <PensionDetailAccordions data={data} />
          {data.pensionType === 'SP' && (
            <>
              <StatePensionMessage data={data} locale={locale} />
              <ClaimingYourStatePension />
            </>
          )}
        </div>
      </div>

      <PensionDetailsSection data={data} />

      {data.pensionType !== 'SP' && (
        <>
          <PlanDetailsTable data={data} />
          <OtherDetailsTable data={data} />
          <PensionDetailsContactTable data={data} />
        </>
      )}

      <AdditionalDataTable data={data} />
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
