import { GetServerSideProps } from 'next';

/** Root route only redirects */
const HomePage = () => null;

export default HomePage;

const DEFAULT_LANGUAGE_HOME = '/en';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: DEFAULT_LANGUAGE_HOME,
      permanent: false,
    },
  };
};
