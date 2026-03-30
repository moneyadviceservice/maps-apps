import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityPensionLoss: StepComponent = ({ errors }) => {
  const { tList } = useTranslation();
  const formContentKey =
    'components.eligibility-pension-loss.form.radio-button';
  const sections = tList('components.eligibility-pension-loss.sections');
  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="eligibility-pension-loss-section"
      />
      <OptionTypes
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
