import { StepComponent } from '../../lib/types';
import { OptionTypes } from '../OptionTypes';

export const InsuranceType: StepComponent = ({ errors, step }) => {
  const contentKey = 'components.insurance-type';

  return (
    <OptionTypes
      errors={errors}
      step={step}
      optionsContentKey={`${contentKey}.form.flow.options`}
      formErrorContentKey={`${contentKey}.form.flow.error`}
    />
  );
};
