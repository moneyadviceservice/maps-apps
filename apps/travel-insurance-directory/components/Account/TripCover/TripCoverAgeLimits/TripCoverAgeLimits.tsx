import { useState } from 'react';

import { useRouter } from 'next/router';

import { FieldError } from 'components/form/FieldError';
import { FormPage } from 'components/form/FormPage';
import { SelectQuestion } from 'components/form/SelectQuestion';
import {
  getAgeLimitFieldLabels,
  TRIP_COVER_AGE_LIMIT_OPTIONS,
  TRIP_COVER_AGE_MODES,
  TRIP_COVER_DURATION_SECTIONS,
} from 'data/pages/account/tripCover/tripCoverConfig';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { withChangeAnswerApiUrl } from 'lib/account/tripCover/confirm';
import {
  ageLimitFieldKey,
  formatAgeLimitsToFormValues,
} from 'lib/account/tripCover/TripCoverAgeLimits';
import type {
  CoverArea,
  TripCoverAgeLimits as TripCoverAgeLimitsData,
  TripType,
} from 'types/travel-insurance-firm';
import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler/createSubmitHandler';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Heading } from '@maps-react/common/index';

const submitApi = '/api/account/trip-cover/age-limits';

export type TripCoverAgeLimitsProps = {
  firmId: string;
  coverArea: CoverArea;
  tripType: TripType;
  initialAgeLimits: TripCoverAgeLimitsData;
  isChangeAnswer?: boolean;
};

export const TripCoverAgeLimits = ({
  firmId,
  coverArea,
  tripType,
  initialAgeLimits,
  isChangeAnswer = false,
}: TripCoverAgeLimitsProps) => {
  const router = useRouter();
  const { setFormSummaryErrors } = useErrorSummary();
  const [isPending, setIsPending] = useState(false);

  const initialValues = formatAgeLimitsToFormValues(initialAgeLimits);
  const ageLimitFieldLabels = getAgeLimitFieldLabels();

  const onSubmit = createSubmitHandler({
    apiUrl: withChangeAnswerApiUrl(submitApi, isChangeAnswer),
    setIsPending,
    setFormSummaryErrors,
    router,
  });

  return (
    <FormPage
      key={`${firmId}-${coverArea}-${tripType}`}
      submitAction={(e) => onSubmit(e)}
      nonJsSubmitFallback={withChangeAnswerApiUrl(submitApi, isChangeAnswer)}
      isPending={isPending}
      formName="trip-cover-age-limits"
      submitButtonLabel={isChangeAnswer ? 'Save changes' : 'Continue'}
    >
      <input type="hidden" name="firmId" value={firmId} />
      <input type="hidden" name="coverArea" value={coverArea} />
      <input type="hidden" name="tripType" value={tripType} />
      {isChangeAnswer ? (
        <input type="hidden" name="isChangeAnswer" value="true" />
      ) : null}

      <Paragraph className="mb-8">
        Enter the maximum age that can be covered for the destination, duration
        and type of trip.
      </Paragraph>

      {TRIP_COVER_DURATION_SECTIONS.map(({ bucket, label }) => (
        <div key={bucket} className="mb-10">
          <Heading level="h3" component="h2" className="mb-4">
            {label}
          </Heading>

          {TRIP_COVER_AGE_MODES.map(({ mode }) => {
            const fieldKey = ageLimitFieldKey(bucket, mode);

            return (
              <FieldError key={fieldKey} fieldKey={fieldKey} className="mt-6">
                <SelectQuestion
                  selectInput={{
                    key: fieldKey,
                    title: ageLimitFieldLabels[fieldKey],
                    options: TRIP_COVER_AGE_LIMIT_OPTIONS,
                  }}
                  initialValue={initialValues[fieldKey]}
                />
              </FieldError>
            );
          })}
        </div>
      ))}
    </FormPage>
  );
};
