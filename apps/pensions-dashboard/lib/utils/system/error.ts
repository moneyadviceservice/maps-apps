/* eslint-disable no-console */

import {
  DEFAULT_LOAD_TIME,
  LOAD_TIMES_FAILED,
  SESSION_EXPIRED,
} from '../../constants';
import { PensionsDataLoadTimes, Redirect, UserSession } from '../../types';

type LogParams = {
  message: string;
  data?: unknown;
  session?: UserSession;
  url?: string;
};

const formatLog = (
  level: string,
  { message, data, session, url }: LogParams,
): string => {
  const logParts = [`// == [${level}] ===============`, `Message: ${message}`];

  if (url) {
    logParts.push(`URL: ${url}`);
  }

  if (session) {
    logParts.push(`Session: ${JSON.stringify(session, null, 2)}`);
  }

  if (data) {
    logParts.push('Data:', JSON.stringify(data, null, 2));
  }

  return logParts.join('\n');
};

export const logger = {
  log: (params: LogParams): void => {
    console.log(formatLog('LOG', params));
  },

  error: (params: LogParams): void => {
    console.error(formatLog('ERROR', params));
  },

  warn: (params: LogParams): void => {
    console.warn(formatLog('WARN', params));
  },
};

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
