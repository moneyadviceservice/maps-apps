import { StepComponent } from '../../lib/types';
import { OptionTypes } from '../OptionTypes';

export const AppointmentType: StepComponent = ({ errors, step }) => {
  const contentKey = 'components.appointment-type';

  return (
    <OptionTypes
      step={step}
      errors={errors}
      optionsContentKey={`${contentKey}.form.radio-button.options`}
      formErrorContentKey={`${contentKey}.form.radio-button.error`}
    />
  );
};
