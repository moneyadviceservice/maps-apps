import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityOver50: StepComponent = ({ errors }) => {
  const formContentKey = 'components.eligibility-over-50.form.radio-button';

  return (
    <OptionTypes
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
