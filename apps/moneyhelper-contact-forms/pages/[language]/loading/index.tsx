/*eslint-disable no-console */
import { GetServerSideProps, NextPage } from 'next';

import { Loading } from '../../../components';
import { runGuards } from '../../../guards';
import { ContactFormsLayout } from '../../../layouts/ContactFormsLayout';
import { StepName } from '../../../lib/constants';
import { PageProps } from '../../../lib/types';
import { getCurrentStep, getSessionId } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';
import { getStoreEntry, getStoreFlow } from '../../../store';

const Page: NextPage<PageProps> = ({ step, entry }) => {
  const lang = entry.data.lang || 'en';
  const url = `/${lang}/confirmation`;

  return (
    <ContactFormsLayout step={step} hasTitle={false}>
      <Loading />
      <meta httpEquiv="refresh" content={`2;url=${url}`} />
    </ContactFormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context, routeConfig);

    // Get the collected data from the store
    const key = getSessionId(context);
    if (!key) {
      throw new Error('[loading] Session ID not found');
    }

    // Increment the step index in the store entry
    const { entry, store } = await getStoreEntry(key);
    entry.stepIndex++;
    await store.setJSON(key, entry);

    // Return props for the page
    return {
      props: {
        step: getCurrentStep(context),
        flow: await getStoreFlow(context),
        entry,
      },
    };
  } catch (error) {
    console.warn('Error on loading page:', error); // DEBUG
    return {
      redirect: {
        destination: `./${StepName.ERROR}`,
        permanent: false,
      },
    };
  }
};

export default Page;
