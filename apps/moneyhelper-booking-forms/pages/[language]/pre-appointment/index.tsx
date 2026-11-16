import { GetServerSideProps, NextPage } from 'next';

import { useTranslation } from '@maps-digital/shared/hooks';

import {
  getStoreEntry,
  getStoreErrors,
  getStoreFlow,
} from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';
import { getSessionId } from '@maps-react/mhf/utils';
import { getBackStep } from '@maps-react/mhf/utils/getBackStep';

import { PreAppointment } from '../../../components';
import { runGuards } from '../../../guards';
import { BookingFormsLayout } from '../../../layouts/BookingFormsLayout';
import { AppErrorCode, StepName } from '../../../lib/constants';
import { useBookingFormsAnalytics } from '../../../lib/hooks';
import { BookingEntry } from '../../../lib/types';
import { getErrorRedirect } from '../../../lib/utils';

const Page: NextPage<PageProps> = ({
  step,
  backStep,
  errors,
  entry,
  url,
  flow,
}) => {
  useBookingFormsAnalytics({ step, entry, errors, url });
  const { t } = useTranslation();
  return (
    <BookingFormsLayout
      back={backStep}
      errors={errors}
      step={step}
      flow={flow}
      entry={entry}
      title={t(`components.${StepName.PRE_APPOINTMENT}.${flow}.title`)}
      hasFullWidth={true}
    >
      <PreAppointment step={step} entry={entry} errors={errors} flow={flow} />
    </BookingFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context);

    // Get key for the store entry
    const key = getSessionId(context);

    return {
      props: {
        step: StepName.PRE_APPOINTMENT,
        backStep: await getBackStep(context),
        errors: await getStoreErrors(context),
        flow: await getStoreFlow(context),
        entry: (await getStoreEntry(key)) as BookingEntry,
        url: context.resolvedUrl,
      },
    };
  } catch (error: unknown) {
    console.warn(`Error on ${StepName.PRE_APPOINTMENT} page:`, error); // DEBUG
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
