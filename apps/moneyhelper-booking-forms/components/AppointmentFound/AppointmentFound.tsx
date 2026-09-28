import { Heading } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components/OptionTypes/OptionTypes';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';
import { AppointmentSummaryCallout } from '../AppointmentSummaryCallout';

export const AppointmentFound: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  if (!entry) {
    throw new TypeError('[AppointmentFound] Missing entry');
  }

  const { t } = useTranslation();
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.appointmentFoundAction}`;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AppointmentSummaryCallout stepName={step} entry={entry} />
      <div>
        <Heading component="h2" level="h1" data-testid={`${step}-form--title`}>
          {t(`${contentKey}.title`)}
        </Heading>
        <OptionTypes
          step={step}
          name={FormFieldName.APPOINTMENT_FOUND_ACTION}
          errors={errors ?? {}}
          optionsContentKey={`${formContentKey}.options`}
          formErrorContentKey={`${formContentKey}.error`}
        />
      </div>
    </div>
  );
};
