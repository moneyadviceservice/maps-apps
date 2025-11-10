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
import { getPensionDetailById } from '../../../../lib/api/pension-data-service';
import { BACK_LINKS } from '../../../../lib/constants';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../../lib/types';
import { processBenefitIllustrations } from '../../../../lib/utils/data';
import {
  getDashboardChannel,
  getMhpdSessionConfig,
  getUserSessionFromCookies,
  handlePageError,
  logger,
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
    logger.error({
      message:
        'Exiting to error page. No pension id found in session config cookie',
      url: `${language}/pension-details/your-pension-summary`,
      session: userSession,
      data: {
        pensionID: id,
      },
    });
    return { notFound: true };
  }

  storeCurrentUrl(context);
  const { channel } = getDashboardChannel(context);

  try {
    const data = await getPensionDetailById(id, { userSession });

    if (!data) {
      logger.error({
        message: 'Exiting to error page. No pension detail data found from API',
        url: `${language}/pension-details/your-pension-summary`,
        session: userSession,
        data: {
          pensionID: id,
        },
      });
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
