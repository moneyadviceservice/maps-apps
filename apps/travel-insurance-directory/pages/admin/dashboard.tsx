import { GetServerSideProps } from 'next';

import { getAdminSession } from 'lib/auth/sessionManagement';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

type Props = {
  user: { name?: string; email?: string };
};

const Dashboard = ({ user }: Props) => (
  <Container>
    <div className="lg:max-w-[980px] space-y-6 py-8">
      <Heading level="h1">Admin dashboard</Heading>
      <Paragraph>
        Signed in as {user.name ?? '—'} ({user.email ?? '—'})
      </Paragraph>
      <div className="flex gap-4">
        <Link href="/api/auth/signout">Sign out</Link>
      </div>
    </div>
  </Container>
);

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const requireAdmin = true;
  const session = await getAdminSession(context, requireAdmin);

  if ('redirect' in session) {
    return session;
  }

  const user = {
    name: session?.name,
    email: session?.username,
  };

  return {
    props: {
      user,
    },
  };
};
