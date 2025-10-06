import { GetServerSideProps } from 'next';

import { BasePageLayout } from 'layouts/BasePageLayout';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
};

const Page = ({ siteConfig, assetPath }: Props) => {
  return (
    <BasePageLayout
      pageTitle=""
      siteConfig={siteConfig}
      assetPath={assetPath}
      breadcrumbs={[]}
    >
      page
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

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang,
      page: {},
    },
  };
};
