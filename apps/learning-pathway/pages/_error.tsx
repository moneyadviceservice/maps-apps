import { GetServerSideProps } from 'next';

import { getErrorPageContent } from 'data/error-page-content';
import { BaseLayout } from 'layout/BasePageLayout/BaseLayout';
import { SiteConfigType } from 'lib/types/site.type';
import { fetchSiteSettings } from 'lib/utils/fetchContent/fetchContent';

import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  siteConfig: SiteConfigType;
  assetPath: string;
  language: string;
};

const ErrorPage = ({ siteConfig, assetPath, language }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseLayout
      bannerTitle={t('bannerTitle')}
      siteConfig={siteConfig}
      seoTitle={t('error-page.seoTitle')}
      seoDescription={t('error-page.seoTitle')}
      assetPath={assetPath}
      language={language}
      pageType="Error"
      categoryLevels={['Error']}
    >
      {getErrorPageContent(language, t)}
    </BaseLayout>
  );
};

export default ErrorPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  res,
}) => {
  if (res) {
    res.statusCode = 404;
  }

  const language = Array.isArray(query?.language)
    ? query.language[0]
    : (query?.language as string) ?? 'en';

  const siteConfig = await fetchSiteSettings(language);

  return {
    props: {
      siteConfig: {
        seoTitle: siteConfig?.seoTitle ?? '',
        seoDescription: siteConfig?.seoDescription ?? '',
        headerLogo: siteConfig?.headerLogo ?? {
          image: { _path: '', width: 0, height: 0, mimeType: '' },
          altText: '',
        },
        navigation: siteConfig?.navigation ?? [],
        footerLinks: siteConfig?.footerLinks ?? [],
      },
      assetPath: process.env.AEM_HOST ?? '',
      language,
    },
  };
};
