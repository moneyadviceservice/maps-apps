import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components';
import { SectionsRenderer } from '@maps-react/mhf/components/SectionsRenderer/SectionsRenderer';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityUKPensions: StepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { tList } = useTranslation();
  const formContentKey = 'components.eligibility-uk-pensions.form.radio-button';
  const sections = tList('components.eligibility-uk-pensions.sections');
  const name = 'nextStep';

  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="eligibility-uk-pensions"
      />
      <OptionTypes
        name={name}
        step={step}
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
        defaultChecked={entry?.data?.[name] ?? ''}
      />
    </>
  );
};
