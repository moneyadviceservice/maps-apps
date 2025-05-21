import { GetServerSideProps } from 'next';

import { AdminPageLayout } from 'layouts/AdminPageLayout';
import { SiteSettings } from 'types/@adobe/site-settings';
import { AdminUser } from 'types/admin/base';
import { fetchSiteSettings } from 'utils/fetch';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  user: AdminUser;
};

const Page = ({ siteConfig, assetPath, user }: Props) => {
  return (
    <AdminPageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={'Admin'}
      user={user}
    >
      Redirect to login...
    </AdminPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async () => {
  const lang = 'en';

  const siteConfig = await fetchSiteSettings(lang);

  const user = { name: 'Joe Blogs', email: 'email@domain.com' };

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      user: user,
    },
  };
};
