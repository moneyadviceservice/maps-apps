/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { ErrorPageLayout } from '@maps-react/layouts/ErrorPageLayout';

import { getFlowSteps, getSessionId } from '../../../lib/utils';
import { getStoreEntry } from '../../../store';

const ErrorPage: NextPage = () => {
  return <ErrorPageLayout isEmbedded={false} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const key = getSessionId(context);
    if (!key) {
      throw new Error('No session ID found');
    }

    const { entry } = await getStoreEntry(key);
    const flow = getFlowSteps(entry);
    console.info('ErrorPage - Store Entry:', entry); // DEBUG
    console.info('ErrorPage - Flow:', flow); // DEBUG

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
