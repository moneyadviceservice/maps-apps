import { GetServerSideProps } from 'next';

import { AdminPageLayout } from 'layouts/AdminPageLayout';
import { getUserSession } from 'lib/auth/sessionManagement/getUserSession';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  isAuthenticated: boolean;
};

const Page = ({ siteConfig, assetPath, isAuthenticated }: Props) => {
  return (
    <AdminPageLayout
      siteConfig={siteConfig}
      assetPath={assetPath}
      pageTitle={'Admin'}
      isAuthenticated={isAuthenticated}
    >
      <H1 className="mt-12 pt-12 text-center">Sign in to your admin account</H1>
      <div className="text-center p-12">
        {isAuthenticated ? (
          <>
            <Paragraph className="pb-8">
              You are currently signed in on an account that does not have admin
              access. Please sign out to sign in with an admin account.
            </Paragraph>
            <Button
              href={`/api/auth/signout?redirectTo=${encodeURIComponent(
                '/admin',
              )}`}
              className="w-48"
              as="a"
            >
              Sign out
            </Button>
          </>
        ) : (
          <Button
            href={`/api/auth/signin?redirectTo=${encodeURIComponent(
              '/admin/dashboard',
            )}`}
            className="w-48"
            as="a"
          >
            Sign in
          </Button>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = 'en';

  const siteConfig = await fetchSiteSettings(lang);

  const session = await getUserSession(context);

  const isAuthenticated = !!session?.isAuthenticated;

  if (isAuthenticated && session?.isAdmin) {
    return {
      redirect: {
        destination: `/admin/dashboard`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      isAuthenticated: isAuthenticated,
    },
  };
};
