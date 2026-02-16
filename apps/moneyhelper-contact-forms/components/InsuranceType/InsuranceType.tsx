import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const InsuranceType: StepComponent = ({ errors, step }) => {
  const contentKey = 'components.insurance-type';

  return (
    <OptionTypes
      errors={errors}
      step={step}
      optionsContentKey={`${contentKey}.form.radio-button.options`}
      formErrorContentKey={`${contentKey}.form.radio-button.error`}
    />
  );
};
