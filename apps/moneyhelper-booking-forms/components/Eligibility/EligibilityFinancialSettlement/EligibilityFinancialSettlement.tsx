import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityFinancialSettlement: BookingStepComponent = ({
  errors,
  step,
}) => {
  const { tList } = useTranslation();
  const componentKey = `components.${StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT}`;
  const formContentKey = `${componentKey}.form.radio-button`;
  const sections = tList(`${componentKey}.sections`);
  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix={StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT}
      />
      <OptionTypes
        step={step}
        name="eligibilityFinancialSettlementStatus"
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
