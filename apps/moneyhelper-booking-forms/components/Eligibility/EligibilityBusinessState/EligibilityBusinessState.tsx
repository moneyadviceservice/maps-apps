import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { StepName } from '../../../lib/constants';

export const EligibilityBusinessState: StepComponent = ({
  errors,
  entry,
  step,
}) => {
  const formContentKey =
    'components.eligibility-business-state.form.radio-button';
  const name = 'businessState';

  return (
    <OptionTypes
      step={step}
      name={name}
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
      defaultChecked={entry?.data?.[name] ?? ''}
      nextStep={StepName.ACCESS_SUPPORT}
    />
  );
};
