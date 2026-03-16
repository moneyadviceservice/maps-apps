import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityAgeExceptions: StepComponent = ({ errors }) => {
  const formContentKey =
    'components.eligibility-age-exceptions.form.radio-button';

  return (
    <OptionTypes
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
