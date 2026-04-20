import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityOver50: StepComponent = ({ errors, entry, step }) => {
  const formContentKey = 'components.eligibility-over-50.form.radio-button';
  const name = 'nextStep';

  return (
    <OptionTypes
      step={step}
      name={name}
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
      defaultChecked={entry?.data?.[name] ?? ''}
    />
  );
};
