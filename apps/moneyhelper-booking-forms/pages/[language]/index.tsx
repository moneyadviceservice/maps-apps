import type { GetServerSideProps, NextPage } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';
import { FormsLayout } from '@maps-react/mhf/layouts';
import { getStoreErrors } from '@maps-react/mhf/store';
import type { PageProps } from '@maps-react/mhf/types';

import { AppointmentType, NoJsNotice } from '../../components';
import { runGuards } from '../../guards';
import { BookingFormsLayout } from '../../layouts/BookingFormsLayout';
import { AppErrorCode, StepName } from '../../lib/constants';
import { useBookingFormsAnalytics } from '../../lib/hooks/useBookingFormsAnalytics';
import { getErrorRedirect } from '../../lib/utils/getErrorRedirect';

/**
 * Root landing renders the appointment-type step while keeping the URL clean.
 * Guards run against a synthetic appointment-type path to keep stepIndex in sync. (see validateStepGuard)
 * Shows a no-js notice if JavaScript is disabled, otherwise shows the appointment type step.
 */
const Page: NextPage<PageProps> = ({ step, errors, url }) => {
  useBookingFormsAnalytics({ step, errors, url });

  const { t } = useTranslation();

  return (
    <>
      <div className="hidden [html.no-js_&]:block">
        <FormsLayout step={step} title={t('components.no-js-notice.title')}>
          <NoJsNotice />
        </FormsLayout>
      </div>
      <div className="[html.no-js_&]:hidden">
        <BookingFormsLayout errors={errors} step={step}>
          <AppointmentType errors={errors} step={step} />
        </BookingFormsLayout>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run guards against the appointment-type step to ensure correct flow and stepIndex, while keeping the URL clean at the root.
    await runGuards({
      ...context,
      resolvedUrl: `/${context.params?.language}/${StepName.APPOINTMENT_TYPE}`,
    });

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
        destination: `${getErrorRedirect(context)}?status=${
          AppErrorCode.ROUTE_SETUP_FALLBACK
        }`,
        permanent: false,
      },
    };
  }
};

export default Page;
