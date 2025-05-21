import { GetServerSideProps } from 'next';

import { PaginatedTable } from 'components/admin/PaginatedTable';
import { AdminPageLayout } from 'layouts/AdminPageLayout';
import { AdminSettings } from 'types/@adobe/site-settings';
import { AdminUser } from 'types/admin/base';
import { fetchSiteSettings } from 'utils/fetch';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const Dashboard = () => (
  <>
    <div className="md:flex justify-between items-center">
      <div>
        <H1 className="font-semibold">SFS Members</H1>
        <Paragraph>View and manage members of the SFS</Paragraph>
      </div>
      <div className="my-4 md:my-0 flex justify-end">
        <Button
          as="a"
          href="/api/export-organisations"
          target="_blank"
          variant="secondary"
        >
          Export data
        </Button>
      </div>
    </div>
    <PaginatedTable />
  </>
);

type Props = {
  siteConfig: AdminSettings;
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
      <Dashboard />
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
