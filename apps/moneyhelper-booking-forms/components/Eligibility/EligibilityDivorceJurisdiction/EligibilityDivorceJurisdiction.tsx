import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityDivorceJurisdiction: BookingStepComponent = ({
  errors,
  step,
}) => {
  const { tList } = useTranslation();
  const componentKey = `components.${StepName.ELIGIBILITY_DIVORCE_JURISDICTION}`;
  const formContentKey = `${componentKey}.form.radio-button`;
  const sections = tList(`${componentKey}.sections`);
  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix={StepName.ELIGIBILITY_DIVORCE_JURISDICTION}
      />
      <OptionTypes
        step={step}
        nextStep={StepName.ACCESS_SUPPORT}
        name="eligibilityDivorceJurisdictionStatus"
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
