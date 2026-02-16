import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components';
import { SectionsRenderer } from '@maps-react/mhf/components/SectionsRenderer/SectionsRenderer';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityUKPensions: StepComponent = ({ errors }) => {
  const { tList } = useTranslation();
  const formContentKey = 'components.eligibility-uk-pensions.form.radio-button';
  const sections = tList('components.eligibility-uk-pensions.sections');

  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="eligibility-uk-pensions"
      />
      <OptionTypes
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
