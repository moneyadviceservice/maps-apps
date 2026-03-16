import { GetServerSideProps, NextPage } from 'next';

import { getStoreErrors } from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';

import { AppointmentType } from '../../components';
import { runGuards } from '../../guards';
import { BookingFormsLayout } from '../../layouts/BookingFormsLayout';
import { StepName } from '../../lib/constants';
import { useBookingFormsAnalytics } from '../../lib/hooks/useBookingFormsAnalytics';
import { getErrorRedirect } from '../../lib/utils/getErrorRedirect';

/**
 * Root landing renders the appointment-type step while keeping the URL clean.
 * Guards run against a synthetic appointment-type path to keep stepIndex in sync. (see validateStepGuard)
 */
const Page: NextPage<PageProps> = ({ step, errors, url }) => {
  useBookingFormsAnalytics({ step, errors, url });

  return (
    <BookingFormsLayout errors={errors} step={step}>
      <AppointmentType errors={errors} step={step} />
    </BookingFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run guards against the appointment-type step to ensure correct flow and stepIndex
    const modifiedContext = {
      ...context,
      resolvedUrl: `/${context.params?.language}/${StepName.APPOINTMENT_TYPE}`,
    };
    await runGuards(modifiedContext);

    return {
      props: {
        step: StepName.APPOINTMENT_TYPE,
        errors: await getStoreErrors(context),
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on index page:', error); // DEBUG
    return {
      redirect: {
        destination: getErrorRedirect(context),
        permanent: false,
      },
    };
  }
};

export default Page;
