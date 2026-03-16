import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityFinancialSettlement: StepComponent = ({ errors }) => {
  const { tList } = useTranslation();
  const formContentKey =
    'components.eligibility-financial-settlement.form.radio-button';
  const sections = tList(
    'components.eligibility-financial-settlement.sections',
  );
  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="eligibility-defined-contribution"
      />
      <OptionTypes
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
