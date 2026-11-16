import { GetServerSideProps } from 'next';

import { SfsV3Layout } from 'layouts/SfsV3Layout/SfsV3Layout';
import { getUserSession } from 'lib/auth/sessionManagement';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';

import { H1 } from '@maps-react/common/index';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  lang: string;
  isAuthenticated: boolean;
};

const Page = ({ siteConfig, assetPath, lang, isAuthenticated }: Props) => {
  return (
    <SfsV3Layout
      siteConfig={siteConfig}
      assetPath={assetPath}
      isAuthenticated={isAuthenticated}
      lang={lang}
      slug={['/v3']}
      breadcrumbs={[
        {
          text: 'SFS V3',
          description: '',
          linkTo: '/v3',
        },
      ]}
    >
      <H1 className="mb-4">SFS V3 Development Area</H1>
    </SfsV3Layout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);
  const session = await getUserSession(context);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang: lang,
      isAuthenticated: !!session?.isAuthenticated,
    },
  };
};
