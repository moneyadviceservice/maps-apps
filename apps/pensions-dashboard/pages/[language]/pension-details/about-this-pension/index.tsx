import React from 'react';

import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionDetailAbout } from '../../../../components/PensionDetailAbout';
import { PensionDetailHeader } from '../../../../components/PensionDetailHeader';
import { PensionDetailIllustrationDate } from '../../../../components/PensionDetailIllustrationDate';
import { PensionDetailMoreInfo } from '../../../../components/PensionDetailMoreInfo';
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

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={data.schemeName}
      isOffset={false}
      helpAndSupport
      seoTitle={t('pages.pension-details.about-page-title')}
      showTabsNavigation={true}
    >
      <PensionDetailHeader data={data} />
      <PensionDetailAbout data={data} />
      <PensionDetailMoreInfo data={data} />
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
