import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const PensionType: StepComponent = ({ errors, step }) => {
  const contentKey = 'components.pension-type';

  return (
    <OptionTypes
      errors={errors}
      step={step}
      optionsContentKey={`${contentKey}.form.radio-button.options`}
      formErrorContentKey={`${contentKey}.form.radio-button.error`}
    />
  );
};
