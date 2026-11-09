import { GetServerSideProps, NextPage } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';
import {
  getStoreEntry,
  getStoreErrors,
  getStoreFlow,
} from '@maps-react/mhf/store';
import { Entry, PageProps } from '@maps-react/mhf/types';
import {
  buildFormPath,
  getCurrentStep,
  getSessionId,
  safeT,
} from '@maps-react/mhf/utils';
import { getBackStep } from '@maps-react/mhf/utils/getBackStep';
import { getLanguage } from '@maps-react/utils/language';

import { FormsLayout } from '../../../../form/components/FormsLayout';
import { FORM_BASE_PATH, StepName } from '../../../../form/constants';
import { runGuards } from '../../../../form/guards';
import { routeConfig } from '../../../../form/routes/routeConfig';

const Page: NextPage<PageProps> = ({
  step,
  backStep,
  errors,
  entry,
  url,
  flow,
}) => {
  const { Component } = routeConfig[step] || {};

  if (!Component) {
    throw new TypeError(
      `Component not found in flow: ${flow}, for step: ${step}`,
    );
  }
  const { t } = useTranslation();
  const optionalBack = safeT(t, `${FORM_BASE_PATH}/components.${step}.back`);

  return (
    <FormsLayout
      step={step}
      back={optionalBack ?? backStep}
      errors={errors}
      heading={`${FORM_BASE_PATH}/layout.title`}
      title={t(`${FORM_BASE_PATH}/components.${step}.title`)}
    >
      <Component errors={errors} entry={entry} step={step} />
    </FormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let step = 'generic';
  try {
    // Run any guards for the current step
    await runGuards(context);

    // Get the collected data from the store
    const key = getSessionId(context);
    step = getCurrentStep(context, FORM_BASE_PATH);

    return {
      props: {
        step,
        backStep: await getBackStep(context),
        errors: await getStoreErrors(context),
        flow: await getStoreFlow(context),
        entry: (await getStoreEntry(key)) as Entry,
        url: context.resolvedUrl,
      },
    };
  } catch (error: unknown) {
    console.warn(`Error on ${step} page:`, error); // DEBUG
    return {
      redirect: {
        destination: buildFormPath(
          getLanguage(context.params?.language),
          StepName.ERROR,
          FORM_BASE_PATH,
        ),
        permanent: false,
      },
    };
  }
};

export default Page;
