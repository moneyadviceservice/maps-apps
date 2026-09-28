import { RegisterStepTemplate } from 'layouts/RegisterStepTemplate';
import { page } from 'data/pages/register/scenario';
import { getRegisterServerSideProps } from 'lib/register/getRegisterServerSideProps';
import { FormErrorsState } from 'types/register';

type PageProps = {
  step: keyof typeof page;
  isChangeAnswer: boolean;
  initialErrors: FormErrorsState | null;
  initialValues: Record<string, unknown> | null;
};

const Page = ({
  step,
  initialErrors,
  initialValues,
  isChangeAnswer,
}: PageProps) => (
  <RegisterStepTemplate
    key={step}
    step={step}
    isChangeAnswer={isChangeAnswer}
    initialErrors={initialErrors}
    initialValues={initialValues}
    pageDataMap={page}
    currentPath="/register/scenario"
    wrapperClassName="!mt-0"
    currentFlow="scenario"
  />
);

export default Page;

export const getServerSideProps = getRegisterServerSideProps(true);
