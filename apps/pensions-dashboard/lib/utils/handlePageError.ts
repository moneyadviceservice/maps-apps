import {
  DEFAULT_LOAD_TIME,
  LOAD_TIMES_FAILED,
  SESSION_EXPIRED,
} from '../constants';
import { PensionsDataLoadTimes, Redirect } from '../types';

export const handlePageError = (
  error: unknown,
  language: string,
  errorMessage = 'Error in getServerSideProps:',
): Redirect | { props: PensionsDataLoadTimes } | { notFound: true } => {
  console.error(errorMessage, error);

  const errorMsg = error instanceof Error ? error.message : String(error);

  switch (errorMsg) {
    case SESSION_EXPIRED:
      // Handle session expiration by redirecting to session expired page
      return {
        redirect: {
          destination: `/${language}/your-session-has-expired`,
          permanent: false,
        },
      };

    case LOAD_TIMES_FAILED:
      // For load times errors, return default values to keep the loader working
      return {
        props: {
          expectedTime: DEFAULT_LOAD_TIME,
          remainingTime: DEFAULT_LOAD_TIME,
        },
      };

    default:
      // For all other errors, return 404
      return { notFound: true };
  }
};
