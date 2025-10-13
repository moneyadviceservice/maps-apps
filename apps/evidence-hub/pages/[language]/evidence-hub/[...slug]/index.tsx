import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { DocumentLayout } from 'layouts/DocumentLayout/DocumentLayout';
import { DocumentTemplate } from 'types/@adobe/page';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchPage, fetchSiteSettings } from 'utils/fetch';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  page: DocumentTemplate;
};

const Page = ({ siteConfig, assetPath, page }: Props) => {
  return (
    <BasePageLayout
      pageTitle=""
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
    >
      <DocumentLayout page={page} />
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

  const query = Array.isArray(params?.slug)
    ? {
        slug: params.slug[1],
        pageType: params.slug[0],
      }
    : { slug: '', pageType: '' };

  const page = await fetchPage(lang, query);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      page: page ?? {},
    },
  };
};
