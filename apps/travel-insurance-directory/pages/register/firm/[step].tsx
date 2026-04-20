import { FormErrorsState } from 'components/Register/Register';
import { RegisterStepTemplate } from 'components/RegisterStepTemplate';
import { page } from 'data/pages/register/firmQuestions';
import { getRegisterServerSideProps } from 'lib/register/getRegisterServerSideProps';

type PageProps = {
  step: keyof typeof page;
  isChangeAnswer: boolean;
  initialErrors: FormErrorsState | null;
  initialValues: Record<string, string> | null;
};

const Page = ({
  step,
  initialErrors,
  initialValues,
  isChangeAnswer,
}: PageProps) => (
  <RegisterStepTemplate
    step={step}
    isChangeAnswer={isChangeAnswer}
    initialErrors={initialErrors}
    initialValues={initialValues}
    pageDataMap={page}
    currentPath="/register/firm"
  />
);

export default Page;

export const getServerSideProps = getRegisterServerSideProps(false);
