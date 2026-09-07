import { Heading } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components/OptionTypes/OptionTypes';

import { StepName } from '../../lib/constants';
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
  const componentKey = `components.${StepName.APPOINTMENT_FOUND}`;
  const formContentKey = `${componentKey}.form.radio-button`;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AppointmentSummaryCallout
        stepName={StepName.APPOINTMENT_FOUND}
        entry={entry}
      />
      <div>
        <Heading
          component="h2"
          level="h1"
          data-testid={`StepName.${StepName.APPOINTMENT_FOUND}-form--title`}
        >
          {t(`${componentKey}.title`)}
        </Heading>
        <OptionTypes
          step={step}
          name="appointmentAction"
          errors={errors ?? {}}
          optionsContentKey={`${formContentKey}.options`}
          formErrorContentKey={`${formContentKey}.error`}
        />
      </div>
    </div>
  );
};
