import { OptionTypes } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityBusinessState: BookingStepComponent = ({
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
      defaultChecked={asString(entry?.data?.[name])}
      nextStep={StepName.ACCESS_SUPPORT}
    />
  );
};
