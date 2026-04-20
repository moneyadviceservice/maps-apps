import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const AppointmentType: StepComponent = ({ errors, step }) => {
  const formContentKey = 'components.appointment-type.form.radio-button';

  return (
    <OptionTypes
      step={step}
      name="nextStep"
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
