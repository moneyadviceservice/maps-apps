import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components';
import { SectionsRenderer } from '@maps-react/mhf/components/SectionsRenderer/SectionsRenderer';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityDefinedContribution: StepComponent = ({ errors }) => {
  const { tList } = useTranslation();
  const formContentKey =
    'components.eligibility-defined-contribution.form.radio-button';
  const sections = tList(
    'components.eligibility-defined-contribution.sections',
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
