import { GetServerSideProps } from 'next';

import { cookieGuard } from '@maps-react/mhf/guards';
import { getStoreEntry } from '@maps-react/mhf/store';
import { Entry } from '@maps-react/mhf/types';
import { getSessionId } from '@maps-react/mhf/utils';
import { type Language } from '@maps-react/utils/language';

import { AppErrorCode, AsyncAction } from '../../../../lib/constants';
import {
  getErrorRedirect,
  runSubmissionStateMachine,
} from '../../../../lib/utils';

export default function SubmitActionPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Submit action routes are transient and not part of journey steps, so only enforce cookie/session guard here.
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
    const entry: Entry = await getStoreEntry(key);
    const locale: Language = entry.data.locale;

    return runSubmissionStateMachine({
      entry,
      key,
      locale,
      action,
    });
  } catch (error) {
    console.warn('[Submit Action] ', error); // DEBUG

    return {
      redirect: {
        destination: `${getErrorRedirect(context)}?status=${encodeURIComponent(
          AppErrorCode.SUBMIT_ROUTE_FALLBACK,
        )}`,
        permanent: false,
      },
    };
  }
};
