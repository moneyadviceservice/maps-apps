import { GetServerSideProps, NextPage } from 'next';

import { cookieGuard } from '@maps-react/mhf/guards';
import { getStoreEntry, getStoreFlow } from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId, Language } from '@maps-react/mhf/utils';

import { Loading } from '../../../../components';
import { BookingFormsLayout } from '../../../../layouts/BookingFormsLayout/BookingFormsLayout';
import { AppErrorCode, AsyncAction, StepName } from '../../../../lib/constants';
import { useBookingFormsAnalytics } from '../../../../lib/hooks/useBookingFormsAnalytics';
import { getErrorRedirect } from '../../../../lib/utils';

type LoadingPageProps = PageProps & {
  action: AsyncAction;
  locale: Language;
};

const Page: NextPage<LoadingPageProps> = ({
  step,
  url,
  action,
  locale,
  entry,
}) => {
  useBookingFormsAnalytics({ step, url });
  const submitPath = `/${locale}/${StepName.SUBMIT}/${action}`;

  return (
    <BookingFormsLayout step={step} entry={entry} hasFullWidth={true}>
      <Loading contentKey={action} step={step} />
      <meta httpEquiv="refresh" content={`2;url=${submitPath}`} />
    </BookingFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Loading action routes are stored journey steps; only enforce cookie/session guard here.
    await cookieGuard(context);

    const key = getSessionId(context);
    if (!key) {
      throw new Error('Session ID not found');
    }

    const actionFromPath = context.params?.action;
    const isValidAction =
      typeof actionFromPath === 'string' &&
      Object.values(AsyncAction).includes(actionFromPath as AsyncAction);

    if (!isValidAction) {
      throw new Error('Invalid async action');
    }

    const action = actionFromPath as AsyncAction;
    const entry = await getStoreEntry(key);
    const locale = entry.data.locale;

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        flow: await getStoreFlow(context),
        entry,
        action,
        locale,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('[Loading] ', error); // DEBUG

    return {
      redirect: {
        destination: `${getErrorRedirect(context)}?status=${
          AppErrorCode.LOADING_ROUTE_FALLBACK
        }`,
        permanent: false,
      },
    };
  }
};

export default Page;
