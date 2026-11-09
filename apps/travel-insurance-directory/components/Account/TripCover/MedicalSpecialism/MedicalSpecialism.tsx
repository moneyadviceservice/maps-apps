import { useState } from 'react';

import { useRouter } from 'next/router';

import { FieldError } from 'components/form/FieldError';
import { FormPage } from 'components/form/FormPage';
import { RadioQuestion } from 'components/form/RadioQuestion';
import {
  medicalSpecialismPage,
  radioFieldCoversAll,
  radioFieldSpecialism,
} from 'data/pages/account/tripCover/medical-specialism';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { withChangeAnswerApiUrl } from 'lib/account/tripCover/confirm';
import type { MedicalSpecialismFormFieldKey } from 'lib/account/tripCover/medicalSpecialism';
import { serviceDetailsPath } from 'lib/account/tripCover/steps';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler/createSubmitHandler';

import { Heading } from '@maps-react/common/index';

export type MedicalSpecialismProps = {
  firmId: string;
  initialFormValues?: Partial<Record<MedicalSpecialismFormFieldKey, string>>;
  isChangeAnswer?: boolean;
};

export const MedicalSpecialism = ({
  firmId,
  initialFormValues = {},
  isChangeAnswer = false,
}: MedicalSpecialismProps) => {
  const router = useRouter();
  const { setFormSummaryErrors } = useErrorSummary();

  const [isPending, setIsPending] = useState(false);

  const submitApi = medicalSpecialismPage.submitApi;
  const nextStep = serviceDetailsPath(firmId);

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
      formName={medicalSpecialismPage.formKey}
      submitButtonLabel={isChangeAnswer ? 'Save changes' : 'Continue'}
    >
      <input type="hidden" name="updatePath" value="medical_specialisms" />
      <input type="hidden" name="firmId" value={firmId} />
      {isChangeAnswer ? (
        <input type="hidden" name="isChangeAnswer" value="true" />
      ) : null}
      <div className="mt-8 group/conditional">
        <FieldError fieldKey={radioFieldCoversAll.key}>
          <Heading level="h3" component="h2" className="mb-2">
            {radioFieldCoversAll.heading}
          </Heading>

          <RadioQuestion
            radioInput={radioFieldCoversAll}
            initialValue={initialFormValues[radioFieldCoversAll.key] ?? ''}
            legendClassName="mb-4 mt-0"
          />
        </FieldError>

        <div
          className="hidden mt-10 group-has-[input[value='no']:checked]/conditional:block"
          data-testid="medical-specialism-radios"
        >
          <FieldError fieldKey={radioFieldSpecialism.key}>
            <Heading level="h3" component="h2" className="mb-2">
              {radioFieldSpecialism.heading}
            </Heading>

            <RadioQuestion
              radioInput={radioFieldSpecialism}
              initialValue={initialFormValues[radioFieldSpecialism.key] ?? ''}
              legendClassName="mb-4 mt-0"
            />
          </FieldError>
        </div>
      </div>
    </FormPage>
  );
};
