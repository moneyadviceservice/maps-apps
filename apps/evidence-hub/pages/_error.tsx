import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';

import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';
import { getErrorPageContent } from 'data/error-page-content';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lang = Array.isArray(query?.language)
    ? query?.language[0]
    : query?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);

  return {
    props: {
      lang: lang,
      siteConfig: {
        seoTitle: siteConfig?.seoTitle ?? '',
        seoDescription: siteConfig?.seoDescription ?? '',
        headerLogo: siteConfig?.headerLogo ?? {
          image: { _path: '', width: 0, height: 0, mimeType: '' },
          altText: '',
        },
        mainNavigation: siteConfig?.mainNavigation ?? [],
        navigation: siteConfig?.navigation ?? [],
        footerLinks: siteConfig?.footerLinks ?? [],
      },
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
    },
  };
};

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  lang: string;
};

const Page = ({ siteConfig, assetPath, lang }: Props) => {
  const { z } = useTranslation();

  return (
    <BasePageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
      lang={lang}
      pageTitle={z({
        en: 'Error',
        cy: 'Gwall',
      })}
      categoryLevels={['Error']}
      pageType="Error"
    >
      <Container className="pb-16 max-w-[1272px]">
        {getErrorPageContent(lang, z)}
      </Container>
    </BasePageLayout>
  );
};

export default Page;
