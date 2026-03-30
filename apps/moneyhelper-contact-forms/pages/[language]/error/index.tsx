/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { cleanupSession, getStoreFlow } from '@maps-react/mhf/store/';
import { FormError, PageProps } from '@maps-react/mhf/types';
import { getCurrentStep } from '@maps-react/mhf/utils';

import { ErrorComponent } from '../../../components/ErrorComponent';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { ERROR_MESSAGES } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';

const ErrorPage: NextPage<PageProps> = ({ step, errors, flow, url }) => {
  useContactFormsAnalytics({ step, errors, url });

  return (
    <ContactFormsLayout step="error" hasLayoutContent={false}>
      <ErrorComponent step="error" flow={flow} />
    </ContactFormsLayout>
  );
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

    const message = ERROR_MESSAGES[statusStr] ?? ERROR_MESSAGES['103'];
    const errors: FormError = {
      'error-page': [message],
    };

    return {
      props: {
        step: getCurrentStep(context),
        flow: await getStoreFlow(context),
        errors,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on Error page:', error); // DEBUG

    return {
      props: {},
    };
  } finally {
    await cleanupSession(context);
  }
};

export default ErrorPage;
