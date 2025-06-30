/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { ErrorPageLayout } from '@maps-react/layouts/ErrorPageLayout';

import { ERROR_MESSAGES } from '../../../lib/constants';

const ErrorPage: NextPage = () => {
  return <ErrorPageLayout isEmbedded={false} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { status } = context.query;
    const statusStr =
      typeof status === 'string'
        ? status
        : Array.isArray(status)
        ? status[0]
        : '103'; // fallback to '103' (unknown error)

    const message = ERROR_MESSAGES[statusStr];

    console.warn('Error page accessed with message:', message); // DEBUG

    return {
      props: {},
    };
  } catch (error) {
    // Fetch the store entry for debugging
    console.warn('Error on error page:', error); // DEBUG

    return {
      props: {},
    };
  }
};

export default ErrorPage;
