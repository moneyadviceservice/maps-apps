import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityPensionLoss: BookingStepComponent = ({
  errors,
  step,
}) => {
  const { tList } = useTranslation();
  const componentKey = `components.${StepName.ELIGIBILITY_PENSION_LOSS}`;
  const formContentKey = `${componentKey}.form.radio-button`;
  const sections = tList(`${componentKey}.sections`);

  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix={StepName.ELIGIBILITY_PENSION_LOSS}
      />
      <OptionTypes
        step={step}
        name="eligibilityPensionLossStatus"
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
