import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { HomepageLayout } from 'layouts/HomepageLayout';
import { getUserSession } from 'lib/auth/sessionManagement/getUserSession';
import { HomepageTemplate } from 'types/@adobe/homepage';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchHomepage, fetchSiteSettings } from 'utils/fetch';

import { useTranslation } from '@maps-react/hooks/useTranslation';

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
      pageType="Homepage"
      isAuthenticated={isAuthenticated}
    >
      <HomepageLayout page={page} assetPath={assetPath} lang={lang} />
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);

  const page = await fetchHomepage(lang);

  const session = await getUserSession(context);

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
