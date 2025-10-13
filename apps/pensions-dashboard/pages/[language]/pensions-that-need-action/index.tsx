import { ReactNode } from 'react';

import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { H2 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { LogoutLinkText } from '../../../components/Logout';
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
  handlePageError,
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

  const items = [
    <>
      {t('pages.pensions-that-need-action.to-do.item-1')}{' '}
      <LogoutLinkText
        text={t('pages.pensions-that-need-action.to-do.item-1-logout-link')}
      />
    </>,
    <>{t('pages.pensions-that-need-action.to-do.item-2')}</>,
  ];

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      helpAndSupport
      isOffset={false}
    >
      <div className="xl:grid xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-8">
          <ToolIntro>
            <Markdown
              className="py-4 leading-[1.5] md:py-0 md:text-2xl md:mt-4 md:mb-8"
              content={t('pages.pensions-that-need-action.tool-intro')}
            />
          </ToolIntro>

          <H2 className="mb-6 md:mb-12">
            {t('pages.pensions-that-need-action.to-do.heading')}
          </H2>

          <ListElement
            variant="unordered"
            color="blue"
            className="!mb-7 pl-9 leading-[1.6]"
            items={items.map((item: string | ReactNode) => (
              <>{item}</>
            ))}
          />

          {data.map((item) => (
            <PensionArrangementCallout key={item.externalAssetId} {...item} />
          ))}

          <ScamWarning
            title={t('pages.pensions-that-need-action.scam-warning.heading')}
            className="md:mt-12"
          >
            <Markdown
              content={t(
                'pages.pensions-that-need-action.scam-warning.description',
              )}
            />
          </ScamWarning>
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);
  const language = context.query.language as string;

  storeCurrentUrl(context);
  const { channel } = getDashboardChannel(context);

  try {
    const data = await getAllPensions(userSession);

    if (!data?.redPensions) {
      return { notFound: true };
    }

    return {
      props: {
        data: data.redPensions,
        backLink: BACK_LINKS[channel ?? ''],
      },
    };
  } catch (error) {
    return handlePageError(
      error,
      language,
      'Error fetching unconfirmed pensions:',
    );
  }
};
