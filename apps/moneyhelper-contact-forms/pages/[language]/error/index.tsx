/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { ErrorComponent } from '../../../components/ErrorComponent';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { ERROR_MESSAGES } from '../../../lib/constants';
import { useContactFormsAnalytics } from '../../../lib/hooks';
import { FormError, PageProps } from '../../../lib/types';
import { getCurrentStep } from '../../../lib/utils';
import { cleanupSession } from '../../../lib/utils/cleanupSession';

const ErrorPage: NextPage<PageProps> = ({ step, errors, url }) => {
  useContactFormsAnalytics({ step, errors, url });

  return (
    <ContactFormsLayout step={step} hasLayoutContent={false}>
      <ErrorComponent step={step} />
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

    console.warn('Error page accessed with error:', statusStr); // DEBUG

    return {
      props: {
        step: getCurrentStep(context),
        errors,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    // Fetch the store entry for debugging
    console.warn('Error on Error page:', error); // DEBUG

    return {
      props: {},
    };
  } finally {
    await cleanupSession(context);
  }
};

export default ErrorPage;
