import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangementCallout } from '../../../components/PensionArrangementCallout';
import { ScamWarning } from '../../../components/ScamWarning';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { BACK_LINKS } from '../../../lib/constants';
import { getAllPensions } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import {
  getDashboardChannel,
  getUserSessionFromCookies,
  storeCurrentUrl,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pensions-that-need-action.title');

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      helpAndSupport
    >
      <div className="md:max-w-4xl">
        <Paragraph>
          {t('pages.pensions-that-need-action.description')}
        </Paragraph>

        {data.map((item) => (
          <PensionArrangementCallout key={item.externalAssetId} {...item} />
        ))}

        <ScamWarning
          title={t('pages.pensions-that-need-action.scam-warning.heading')}
        >
          <Markdown
            content={t(
              'pages.pensions-that-need-action.scam-warning.description',
            )}
          />
        </ScamWarning>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);

  storeCurrentUrl(context);
  const { channel } = getDashboardChannel(context);

  try {
    const data = await getAllPensions(userSession);

    if (!data?.unconfirmedPensions) {
      return { notFound: true };
    }

    return {
      props: {
        data: data.unconfirmedPensions,
        backLink: BACK_LINKS[channel ?? ''],
      },
    };
  } catch (error) {
    console.error('Error fetching unconfirmed pensions:', error);
    return { notFound: true };
  }
};
