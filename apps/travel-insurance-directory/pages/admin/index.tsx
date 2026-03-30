import { GetServerSideProps } from 'next';

import { AdminLayout } from 'layouts/AdminLayout';
import { ADMIN_SIGN_IN_URL, ADMIN_SIGN_OUT_URL } from 'lib/auth/routes';
import { getUserSession } from 'lib/auth/sessionManagement';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

type Props = {
  isAuthenticated: boolean;
};

const AdminIndex = ({ isAuthenticated }: Props) => (
  <AdminLayout showSignOut={false}>
    <Container>
      <div className="lg:max-w-[980px] space-y-6 py-12 text-center m-auto">
        <Heading level="h1" className="mt-12 pt-12">
          Sign in to your admin account
        </Heading>
        <div className="p-12">
          {isAuthenticated ? (
            <>
              <Paragraph className="pb-8">
                You are currently signed in on an account that does not have
                admin access. Please sign out to sign in with an admin account.
              </Paragraph>
              <Button href={ADMIN_SIGN_OUT_URL} className="w-48" as="a">
                Sign out
              </Button>
            </>
          ) : (
            <Button href={ADMIN_SIGN_IN_URL} className="w-48" as="a">
              Sign in
            </Button>
          )}
        </div>
      </div>
    </Container>
  </AdminLayout>
);

export default AdminIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getUserSession(context);
  const isAuthenticated = !!session?.isAuthenticated;

  if (isAuthenticated && session?.isAdmin) {
    return {
      redirect: {
        destination: '/admin/dashboard',
        permanent: false,
      },
      props: {
        isAuthenticated: true,
      },
    };
  }

  return {
    props: {
      isAuthenticated: false,
    },
  };
};
