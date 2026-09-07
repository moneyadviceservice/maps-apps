import { useState } from 'react';

import { useRouter } from 'next/router';

import { FieldError } from 'components/form/FieldError';
import { FormPage } from 'components/form/FormPage';
import {
  TRIP_COVER_REGION_FIELD_NAME,
  TRIP_COVER_REGION_OPTIONS,
} from 'data/pages/account/tripCover/tripCoverConfig';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { withChangeAnswerApiUrl } from 'lib/account/tripCover/confirm';
import type { CoverArea } from 'types/travel-insurance-firm';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler/createSubmitHandler';

import { Heading } from '@maps-react/common/index';
import { CheckboxGroup } from '@maps-react/form/components/Checkbox';

const submitApi = '/api/account/trip-cover/regions';

export type RegionsCoveredProps = {
  firmId: string;
  initialSelectedAreas: CoverArea[];
  isChangeAnswer?: boolean;
};

export const RegionsCovered = ({
  firmId,
  initialSelectedAreas,
  isChangeAnswer = false,
}: RegionsCoveredProps) => {
  const router = useRouter();
  const { setFormSummaryErrors } = useErrorSummary();

  const [isPending, setIsPending] = useState(false);

  const onSubmit = createSubmitHandler({
    apiUrl: withChangeAnswerApiUrl(submitApi, isChangeAnswer),
    setIsPending,
    setFormSummaryErrors,
    router,
  });

  const checkboxItems = TRIP_COVER_REGION_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <FormPage
      submitAction={(e) => onSubmit(e)}
      nonJsSubmitFallback={withChangeAnswerApiUrl(submitApi, isChangeAnswer)}
      isPending={isPending}
      formName="regions-covered"
      submitButtonLabel={isChangeAnswer ? 'Save changes' : 'Continue'}
    >
      <input type="hidden" name="firmId" value={firmId} />
      {isChangeAnswer ? (
        <input type="hidden" name="isChangeAnswer" value="true" />
      ) : null}

      <FieldError fieldKey={TRIP_COVER_REGION_FIELD_NAME} className="mt-8">
        <Heading level="h3" component="h2" className="mb-4">
          Which regions do you offer cover for?
        </Heading>

        <CheckboxGroup
          name={TRIP_COVER_REGION_FIELD_NAME}
          label="Which regions do you offer cover for?"
          hideLabel
          items={checkboxItems}
          defaultChecked={initialSelectedAreas}
        />
      </FieldError>
    </FormPage>
  );
};
