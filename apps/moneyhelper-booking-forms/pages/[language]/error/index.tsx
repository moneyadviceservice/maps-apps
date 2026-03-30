/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { cleanupSession } from '@maps-react/mhf/store/';
import { FormError, PageProps } from '@maps-react/mhf/types';
import { getCurrentStep } from '@maps-react/mhf/utils';

import { ErrorComponent } from '../../../components/ErrorComponent';
import { BookingFormsLayout } from '../../../layouts/BookingFormsLayout';
import { useBookingFormsAnalytics } from '../../../lib/hooks';

const ErrorPage: NextPage<PageProps> = ({ step, errors, url }) => {
  useBookingFormsAnalytics({ step, errors, url });

  return (
    <BookingFormsLayout step={step}>
      <ErrorComponent step={step} />
    </BookingFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const errors: FormError = {
      'error-page': ['Unknown Error'],
    };

    return {
      props: {
        step: getCurrentStep(context),
        errors,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    // Fetch the store BookingEntry for debugging
    console.warn('Error on Error page:', error); // DEBUG

    return {
      props: {},
    };
  } finally {
    await cleanupSession(context);
  }
};

export default ErrorPage;
