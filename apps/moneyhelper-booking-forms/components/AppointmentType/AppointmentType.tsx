import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const AppointmentType: StepComponent = ({ errors }) => {
  const formContentKey = 'components.appointment-type.form.radio-button';

  return (
    <OptionTypes
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
