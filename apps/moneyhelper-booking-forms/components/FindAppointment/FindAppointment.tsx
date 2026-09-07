import { DateInput } from '@maps-react/form/components/DateInput/DateInput';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AsyncAction, JourneyType, StepName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const FindAppointment: BookingStepComponent = ({ step, errors }) => {
  const { t, tList } = useTranslation();
  const componentKey = `components.${step}`;
  const componentFormKey = `${componentKey}.form`;
  const sections = tList(`${componentKey}.sections`);

  const fieldNames = {
    dateOfBirth: 'dateOfBirth',
    referenceNumber: 'referenceNumber',
  } as const;

  const localeFieldKeys: Record<keyof typeof fieldNames, string> = {
    dateOfBirth: 'date-of-birth',
    referenceNumber: 'reference-number',
  };

  const fieldErrors = {
    referenceNumber: getFieldError(fieldNames.referenceNumber, errors),
    dateOfBirth: getFieldError(fieldNames.dateOfBirth, errors),
  };

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
            id={fieldNames.referenceNumber}
            name={fieldNames.referenceNumber}
            label={t(
              `${componentFormKey}.${localeFieldKeys.referenceNumber}.label`,
            )}
            hint={t(
              `${componentFormKey}.${localeFieldKeys.referenceNumber}.hint`,
            )}
            type="text"
            data-testid={`input-${fieldNames.referenceNumber}`}
            error={
              fieldErrors.referenceNumber
                ? t(
                    `${componentFormKey}.${localeFieldKeys.referenceNumber}.error`,
                  )
                : undefined
            }
            hasGlassBoxClass
            hasErrorWrapper
          />
          <DateInput
            legend={t(
              `${componentFormKey}.${localeFieldKeys.dateOfBirth}.label`,
            )}
            hintText={t(
              `${componentFormKey}.${localeFieldKeys.dateOfBirth}.hint`,
            )}
            error={
              fieldErrors.dateOfBirth
                ? t(`${componentFormKey}.${localeFieldKeys.dateOfBirth}.error`)
                : undefined
            }
            fieldErrors={{
              day: Boolean(fieldErrors.dateOfBirth),
              month: Boolean(fieldErrors.dateOfBirth),
              year: Boolean(fieldErrors.dateOfBirth),
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
