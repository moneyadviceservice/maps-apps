import { GetServerSideProps, NextPage } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';
import { PageProps } from '@maps-react/mhf/types';

import { FormsLayout } from '../../../../form/components/FormsLayout';
import { SignUpUpdate } from '../../../../form/components/SignUpUpdate';
import { FORM_BASE_PATH, StepName } from '../../../../form/constants';

const SignUpUpdatePage: NextPage<PageProps> = ({ step }) => {
  const { t } = useTranslation();

  return (
    <FormsLayout
      step={step}
      heading={`${FORM_BASE_PATH}/layout.title`}
      title={t(`${FORM_BASE_PATH}/components.${step}.title`)}
    >
      <SignUpUpdate step={step} />
    </FormsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = () => {
  return Promise.resolve({
    props: {
      step: StepName.SIGN_UP_UPDATE,
    },
  });
};

export default SignUpUpdatePage;
