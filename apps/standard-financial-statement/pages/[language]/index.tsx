import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { HomepageLayout } from 'layouts/HomepageLayout';
import { HomepageTemplate } from 'types/@adobe/homepage';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchHomepage, fetchSiteSettings } from 'utils/fetch';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { sessionOptions } from 'lib/auth/sessionOptions';
import { getIronSession, IronSessionData } from 'iron-session';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  page: HomepageTemplate;
  lang: string;
  isAuthenticated: boolean;
};

const Page = ({
  siteConfig,
  assetPath,
  page,
  lang,
  isAuthenticated,
}: Props) => {
  const { z } = useTranslation();

  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
      slug={['/']}
      lang={lang}
      pageTitle={z({
        en: 'Home',
        cy: 'Hafan',
      })}
      isAuthenticated={isAuthenticated}
    >
      <HomepageLayout page={page} assetPath={assetPath} />
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);

  const page = await fetchHomepage(lang);

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionOptions,
  );

  if (page.error) {
    return { notFound: true };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      page: page,
      isAuthenticated: !!session?.isAuthenticated,
    },
  };
};
