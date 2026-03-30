import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EnquiryType: StepComponent = ({ errors, step }) => {
  const formContentKey = 'components.enquiry-type.form.radio-button';

  return (
    <OptionTypes
      errors={errors ?? {}}
      step={step}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
