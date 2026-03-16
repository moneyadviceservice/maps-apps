import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityBusinessState: StepComponent = ({ errors, entry }) => {
  const formContentKey =
    'components.eligibility-business-state.form.radio-button';

  return (
    <OptionTypes
      errors={errors ?? {}}
      name={'businessState'}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
      defaultChecked={entry?.data?.['businessState'] ?? ''}
    />
  );
};
