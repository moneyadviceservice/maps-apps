/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { Guidance } from '../../../components';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { PageProps } from '../../../lib/types';

const Page: NextPage<PageProps> = () => {
  return (
    <ContactFormsLayout>
      <Guidance />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Return props for the page
  return {
    props: {},
  };
};

export default Page;
