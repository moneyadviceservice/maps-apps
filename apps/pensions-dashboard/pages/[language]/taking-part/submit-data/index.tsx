import { GetServerSideProps } from 'next';

import { getStoreEntry } from '@maps-react/mhf/store';
import { Entry } from '@maps-react/mhf/types';
import { buildFormPath, getSessionId } from '@maps-react/mhf/utils';
import { getLanguage } from '@maps-react/utils/language';

import { FORM_BASE_PATH, StepName } from '../../../../form/constants';
import { submitTakingPart } from '../../../../lib/utils/submitTakingPart';

const Page = () => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = getLanguage(context.params?.language);

  try {
    const key = getSessionId(context);
    if (!key) {
      throw new Error('Session ID not found');
    }

    const entry = (await getStoreEntry(key)) as Entry;

    return submitTakingPart({
      entry,
      sessionKey: key,
      locale,
      res: context.res,
    });
  } catch (error) {
    console.warn('Error on taking-part submit page:', error);

    return {
      redirect: {
        destination: buildFormPath(locale, StepName.ERROR, FORM_BASE_PATH),
        permanent: false,
      },
    };
  }
};

export default Page;
