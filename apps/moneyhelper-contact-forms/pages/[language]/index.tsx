import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import { Container } from '@maps-react/core/components/Container';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const Page: NextPage = () => {
  return (
    <ToolPageLayout>
      <Container>
        Placeholder page.
        <Link href="/en/guidance">
          <b> Click here </b>
        </Link>
        for the form journey
      </Container>
    </ToolPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Page;
