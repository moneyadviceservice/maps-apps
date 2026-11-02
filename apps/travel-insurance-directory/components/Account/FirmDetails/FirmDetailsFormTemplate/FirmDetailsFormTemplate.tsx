import { ReactNode, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { DefaultHiddenFields } from 'components/Account/FirmDetails/DefaultHiddenFields';
import { FormPage } from 'components/form/FormPage';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler';

import { Paragraph } from '@maps-react/common/components/Paragraph';

interface PageConfig {
  description: string;
  submitApi: string;
  nextStep: string;
  formKey: string;
}

interface FirmDetailsFormTemplateProps {
  firmId: string;
  isChangeAnswer?: string;
  pageConfig: PageConfig;
  children: ReactNode;
}

export const FirmDetailsFormTemplate = ({
  firmId,
  isChangeAnswer,
  pageConfig,
  children,
}: FirmDetailsFormTemplateProps) => {
  const router = useRouter();
  const { setFormSummaryErrors } = useErrorSummary();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = createSubmitHandler({
    apiUrl: pageConfig.submitApi,
    nextStep: pageConfig.nextStep,
    setIsPending,
    setFormSummaryErrors,
    router,
  });

  const defaultHiddenFields = useMemo(
    () => (
      <DefaultHiddenFields firmId={firmId} isChangeAnswer={isChangeAnswer} />
    ),
    [firmId, isChangeAnswer],
  );

  return (
    <>
      <Paragraph>{pageConfig.description}</Paragraph>
      <FormPage
        submitAction={(e) => onSubmit(e)}
        nonJsSubmitFallback={pageConfig.submitApi}
        isPending={isPending}
        formName={pageConfig.formKey}
        hiddenFields={defaultHiddenFields}
      >
        {children}
      </FormPage>
    </>
  );
};
