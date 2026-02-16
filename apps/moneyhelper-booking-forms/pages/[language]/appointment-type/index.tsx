import { GetServerSideProps, NextPage } from 'next';

const Page: NextPage = () => null;

/**
 * Redirect to the main page. The semantic first step remains "appointment-type", but UX lands on the root URL to keep user-visible URLs clean.
 * Allows for guards and other logic to run in a single place.
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `/${context.params?.language}`,
      permanent: false,
    },
  };
};

export default Page;
