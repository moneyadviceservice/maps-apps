import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { HomepageLayout } from 'layouts/HomepageLayout';
import { HomepageTemplate } from 'types/@adobe/homepage';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchHomepage, fetchSiteSettings, getAllDocuments } from 'utils/fetch';

import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  homepage: HomepageTemplate;
  lang: string;
};

const Page = ({ siteConfig, assetPath, homepage, lang }: Props) => {
  const { z } = useTranslation();
  return (
    <BasePageLayout
      pageTitle={homepage.seoTitle}
      categoryLevels={['Home']}
      pageType="Home"
      bannerTitle={z({
        en: 'The Financial Wellbeing Evidence Hub',
        cy: 'Hwb Tystiolaeth Lles Ariannol',
      })}
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
      lang={lang}
    >
      <HomepageLayout page={homepage} assetPath={assetPath} lang={lang} />
    </BasePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  // Pre-load documents in the background to warm the cache
  // This doesn't block the page render and happens in parallel with other fetches
  getAllDocuments().catch((error) => {
    // Log error but don't fail page load
    console.error('Failed to pre-load documents on homepage:', error);
  });

  const [siteConfig, homepage] = await Promise.all([
    fetchSiteSettings(lang),
    fetchHomepage(lang),
  ]);

  if ('error' in homepage) {
    return { notFound: true };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      homepage,
    },
  };
};
