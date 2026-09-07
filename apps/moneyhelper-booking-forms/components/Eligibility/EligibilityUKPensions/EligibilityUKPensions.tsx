import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components';
import { SectionsRenderer } from '@maps-react/mhf/components/SectionsRenderer/SectionsRenderer';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityUKPensions: BookingStepComponent = ({
  errors,
  step,
}) => {
  const { tList } = useTranslation();
  const componentKey = `components.${StepName.ELIGIBILITY_UK_PENSIONS}`;
  const formContentKey = `${componentKey}.form.radio-button`;
  const sections = tList(`${componentKey}.sections`);

  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix={StepName.ELIGIBILITY_UK_PENSIONS}
      />
      <OptionTypes
        step={step}
        name="eligibilityUkPensionStatus"
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
