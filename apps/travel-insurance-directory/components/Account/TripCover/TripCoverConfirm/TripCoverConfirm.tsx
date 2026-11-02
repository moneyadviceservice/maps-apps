import { useState } from 'react';

import { useRouter } from 'next/router';

import { FormPage } from 'components/form/FormPage';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler/createSubmitHandler';

const submitApi = '/api/account/trip-cover/confirm';
const nextStep = '/account';

export type TripCoverConfirmProps = {
  firmId: string;
};

export const TripCoverConfirm = ({ firmId }: TripCoverConfirmProps) => {
  const router = useRouter();
  const { setFormSummaryErrors } = useErrorSummary();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = createSubmitHandler({
    apiUrl: submitApi,
    nextStep,
    setIsPending,
    setFormSummaryErrors,
    router,
  });

  return (
    <FormPage
      submitAction={(e) => onSubmit(e)}
      nonJsSubmitFallback={submitApi}
      isPending={isPending}
      formName="trip-cover-confirm"
      submitButtonLabel="Confirm"
    >
      <input type="hidden" name="firmId" value={firmId} />
    </FormPage>
  );
};
