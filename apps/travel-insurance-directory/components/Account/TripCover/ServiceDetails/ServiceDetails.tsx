import { useState } from 'react';

import { useRouter } from 'next/router';

import { FieldError } from 'components/form/FieldError';
import { FormPage } from 'components/form/FormPage';
import { RadioQuestion } from 'components/form/RadioQuestion';
import { SelectQuestion } from 'components/form/SelectQuestion';
import {
  radioFieldSpec,
  radioFieldTel,
  selectFieldAdvance,
  selectFieldMed,
  serviceDetailsPage,
} from 'data/pages/account/tripCover/service-details';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { withChangeAnswerApiUrl } from 'lib/account/tripCover/confirm';
import type { ServiceDetailsFormFieldKey } from 'lib/account/tripCover/ServiceDetails';
import { confirmPath } from 'lib/account/tripCover/steps';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler/createSubmitHandler';

import { Heading } from '@maps-react/common/index';

export type ServiceDetailsProps = {
  firmId: string;
  initialFormValues?: Partial<Record<ServiceDetailsFormFieldKey, string>>;
  isChangeAnswer?: boolean;
};

export const ServiceDetails = ({
  firmId,
  initialFormValues = {},
  isChangeAnswer = false,
}: ServiceDetailsProps) => {
  const router = useRouter();
  const { setFormSummaryErrors } = useErrorSummary();

  const [isPending, setIsPending] = useState(false);

  const submitApi = serviceDetailsPage.submitApi;
  const nextStep = confirmPath(firmId);

  const onSubmit = createSubmitHandler({
    apiUrl: withChangeAnswerApiUrl(submitApi, isChangeAnswer),
    nextStep,
    setIsPending,
    setFormSummaryErrors,
    router,
  });

  return (
    <FormPage
      submitAction={(e) => onSubmit(e)}
      nonJsSubmitFallback={withChangeAnswerApiUrl(submitApi, isChangeAnswer)}
      isPending={isPending}
      formName={serviceDetailsPage.formKey}
      submitButtonLabel={isChangeAnswer ? 'Save changes' : 'Continue'}
    >
      <input type="hidden" name="updatePath" value="service_details" />
      <input type="hidden" name="firmId" value={firmId} />
      {isChangeAnswer ? (
        <input type="hidden" name="isChangeAnswer" value="true" />
      ) : null}
      <FieldError fieldKey={radioFieldTel.key} className="mt-8">
        <Heading level="h3" component="h2" className="mb-2">
          {radioFieldTel.heading}
        </Heading>

        <RadioQuestion
          radioInput={radioFieldTel}
          initialValue={initialFormValues[radioFieldTel.key] ?? ''}
          legendClassName="mb-4 mt-0"
        />
      </FieldError>

      <FieldError fieldKey={radioFieldSpec.key} className="mt-10">
        <Heading level="h3" component="h2" className="mb-2">
          {radioFieldSpec.heading}
        </Heading>

        <RadioQuestion
          radioInput={radioFieldSpec}
          initialValue={initialFormValues[radioFieldSpec.key] ?? ''}
          legendClassName="mb-4 mt-0"
        />
      </FieldError>

      <FieldError fieldKey={selectFieldMed.key} className="mt-10">
        <Heading level="h3" component="h2" className="mb-2">
          {selectFieldMed.heading}
        </Heading>

        <SelectQuestion
          selectInput={selectFieldMed}
          initialValue={initialFormValues[selectFieldMed.key] ?? ''}
        />
      </FieldError>

      <FieldError fieldKey={selectFieldAdvance.key} className="mt-10 mb-12">
        <Heading level="h3" component="h2" className="mb-2">
          {selectFieldAdvance.heading}
        </Heading>

        <SelectQuestion
          selectInput={selectFieldAdvance}
          initialValue={initialFormValues[selectFieldAdvance.key] ?? ''}
        />
      </FieldError>
    </FormPage>
  );
};
