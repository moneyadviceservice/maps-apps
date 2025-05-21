import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import { ContactFormsLayout } from '../../layouts/ContactFormsLayout';

const Page: NextPage = () => {
  return (
    <ContactFormsLayout>
      <p>
        Placeholder page.
        <Link href="/en/guidance">
          <b> Click here </b>
        </Link>
        for form journey
      </p>
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Page;
