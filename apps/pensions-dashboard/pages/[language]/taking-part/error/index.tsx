import { GetServerSideProps, NextPage } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';
import { cleanupSession, getStoreFlow } from '@maps-react/mhf/store/';
import { PageProps } from '@maps-react/mhf/types';

import { ErrorComponent } from '../../../../form/components/ErrorComponent';
import { FormsLayout } from '../../../../form/components/FormsLayout';
import { FORM_BASE_PATH, StepName } from '../../../../form/constants';

const ErrorPage: NextPage<PageProps> = ({ step, entry, flow }) => {
  const { t } = useTranslation();

  return (
    <FormsLayout
      step={step}
      title={t(`${FORM_BASE_PATH}/components.${step}.title`)}
    >
      <ErrorComponent step={step} entry={entry} flow={flow} />
    </FormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {
        step: StepName.ERROR,
        flow: await getStoreFlow(context),
        entry: null,
        url: context.resolvedUrl,
      },
    };
  } catch (error) {
    console.warn('Error on Error page:', error); // DEBUG

    return {
      props: {
        step: StepName.ERROR,
        flow: await getStoreFlow(context),
        entry: null,
        error,
        url: context.resolvedUrl,
      },
    };
  } finally {
    await cleanupSession(context);
  }
};

export default ErrorPage;
