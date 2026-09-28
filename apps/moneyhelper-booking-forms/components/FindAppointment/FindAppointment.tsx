import { DateInput } from '@maps-react/form/components/DateInput/DateInput';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  AsyncAction,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  JourneyType,
  StepName,
} from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const FindAppointment: BookingStepComponent = ({ step, errors }) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form`;
  const sections = tList(`${contentKey}.sections`);

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionsRenderer
          sections={sections}
          testIdPrefix={step}
          headingClassName="text-blue-700"
        />
      </div>
      <FormWrapper
        step={step}
        className="md:max-w-md"
        nextStep={`${StepName.LOADING}/${AsyncAction.BOOKING_LOOKUP}`}
      >
        {/* Hidden input to ensure that the journey type is always submitted. */}
        <input type="hidden" name="journeyType" value={JourneyType.CHANGE} />
        <div className="flex flex-col gap-8">
          <TextInput
            id={FormFieldName.REFERENCE_NUMBER}
            name={FormFieldName.REFERENCE_NUMBER}
            label={t(
              `${formContentKey}.${FORM_FIELD_CONTENT_KEY.referenceNumber}.label`,
            )}
            hint={t(
              `${formContentKey}.${FORM_FIELD_CONTENT_KEY.referenceNumber}.hint`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.REFERENCE_NUMBER}`}
            error={
              getFieldError(FormFieldName.REFERENCE_NUMBER, errors)
                ? t(
                    `${formContentKey}.${FORM_FIELD_CONTENT_KEY.referenceNumber}.error`,
                  )
                : undefined
            }
            hasGlassBoxClass
            hasErrorWrapper
          />
          <DateInput
            legend={t(
              `${formContentKey}.${FORM_FIELD_CONTENT_KEY.dateOfBirth}.label`,
            )}
            hintText={t(
              `${formContentKey}.${FORM_FIELD_CONTENT_KEY.dateOfBirth}.hint`,
            )}
            error={
              getFieldError(FormFieldName.DATE_OF_BIRTH, errors)
                ? t(
                    `${formContentKey}.${FORM_FIELD_CONTENT_KEY.dateOfBirth}.error`,
                  )
                : undefined
            }
            fieldErrors={{
              day: Boolean(getFieldError(FormFieldName.DATE_OF_BIRTH, errors)),
              month: Boolean(
                getFieldError(FormFieldName.DATE_OF_BIRTH, errors),
              ),
              year: Boolean(getFieldError(FormFieldName.DATE_OF_BIRTH, errors)),
            }}
            showDayField
            hasErrorWrapper
            hideLegend={false}
          />
        </div>
      </FormWrapper>
    </>
  );
};
