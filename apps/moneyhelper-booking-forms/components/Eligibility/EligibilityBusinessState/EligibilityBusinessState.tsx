import { OptionTypes } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityBusinessState: BookingStepComponent = ({
  errors,
  entry,
  step,
}) => {
  const formContentKey = `components.${step}.form.${FORM_FIELD_CONTENT_KEY.eligibilityBusinessState}`;

  return (
    <OptionTypes
      step={step}
      name={FormFieldName.ELIGIBILITY_BUSINESS_STATE}
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
      defaultChecked={asString(
        entry?.data?.[FormFieldName.ELIGIBILITY_BUSINESS_STATE],
      )}
      nextStep={StepName.ACCESS_SUPPORT}
    />
  );
};
