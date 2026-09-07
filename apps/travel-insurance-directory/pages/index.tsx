import { GetServerSideProps } from 'next';

import { DEFAULT_LANGUAGE_HOME } from 'types/CONSTANTS';

/** Root route only redirects; the shared layout lives in layouts/TravelInsuranceDirectory. */
const HomePage = () => null;

export default HomePage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: DEFAULT_LANGUAGE_HOME,
      permanent: false,
    },
  };
};
