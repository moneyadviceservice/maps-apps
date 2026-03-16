import { GetServerSideProps } from 'next';

import { getUserSession } from 'lib/auth/sessionManagement';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

type Props = {
  isAuthenticated: boolean;
};

const AdminIndex = ({ isAuthenticated }: Props) => (
  <Container>
    <div className="lg:max-w-[980px] space-y-6 py-12 text-center m-auto">
      <Heading level="h1" className="mt-12 pt-12">
        Sign in to your admin account
      </Heading>
      <div className="p-12">
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
    </div>
  </Container>
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
    };
  }

  return {
    props: {
      isAuthenticated,
    },
  };
};
