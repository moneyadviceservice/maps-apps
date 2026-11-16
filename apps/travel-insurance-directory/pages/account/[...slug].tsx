import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { notFound: true };
};

const AccountUnknownRoutePage = () => null;

export default AccountUnknownRoutePage;
