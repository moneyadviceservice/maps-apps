/*eslint-disable no-console */
import { GetServerSideProps } from 'next';

import { getStoreEntry } from '@maps-react/mhf/store';
import { getSessionId } from '@maps-react/mhf/utils';

import { runGuards } from '../../../guards';
import { StepName } from '../../../lib/constants';
import { SubmissionEntry } from '../../../lib/types';
import { runSubmitFlow } from '../../../lib/utils';

export default function SubmitPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await runGuards(context);

    const key = getSessionId(context);
    if (!key) {
      throw new Error('[submit] Session ID not found');
    }

    const entry = (await getStoreEntry(key)) as SubmissionEntry;
    const lang = entry.data.lang || 'en';
    const code = process.env.API_CODE;
    const url = process.env.API_URL;

    if (!code || !url) {
      throw new Error('API code or URL is not set in environment variables');
    }

    return runSubmitFlow({
      entry,
      key,
      lang,
      code,
      url,
    });
  } catch (error) {
    console.warn('Error on submit page:', error); // DEBUG

    return {
      redirect: {
        destination: `./${StepName.ERROR}?status=103`,
        permanent: false,
      },
    };
  }
};
