import { GetServerSideProps, NextPage } from 'next';

import { cookieGuard } from '@maps-react/mhf/guards';
import { getStoreEntry, getStoreFlow } from '@maps-react/mhf/store';
import { Entry, PageProps } from '@maps-react/mhf/types';
import { buildFormPath, getSessionId } from '@maps-react/mhf/utils';
import { getLanguage } from '@maps-react/utils/language';

import { FormsLayout } from '../../../../form/components/FormsLayout';
import { Loading } from '../../../../form/components/Loading';
import { FORM_BASE_PATH, StepName } from '../../../../form/constants';

const Page: NextPage<PageProps> = ({ step, entry }) => {
  const submitPath = buildFormPath(
    entry.data.locale,
    StepName.SUBMIT_DATA,
    FORM_BASE_PATH,
  );

  return (
    <FormsLayout
      step={step}
      hasTitle={false}
      heading={`${FORM_BASE_PATH}/layout.title`}
      hasFullWidth={true}
    >
      <Loading submitPath={submitPath} />
    </FormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = getLanguage(context.params?.language);

  try {
    await cookieGuard(context);

    const key = getSessionId(context);
    if (!key) {
      throw new Error('Session ID not found');
    }

    return {
      props: {
        step: StepName.LOADING,
        flow: await getStoreFlow(context),
        errors: {},
        entry: (await getStoreEntry(key)) as Entry,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on taking-part loading page:', error);

    return {
      redirect: {
        destination: buildFormPath(locale, StepName.ERROR, FORM_BASE_PATH),
        permanent: false,
      },
    };
  }
};

export default Page;
