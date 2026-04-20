import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityFinancialSettlement: StepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { tList } = useTranslation();
  const formContentKey =
    'components.eligibility-financial-settlement.form.radio-button';
  const sections = tList(
    'components.eligibility-financial-settlement.sections',
  );
  const name = 'nextStep';
  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="eligibility-defined-contribution"
      />
      <OptionTypes
        step={step}
        name={name}
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
        defaultChecked={entry?.data?.[name] ?? ''}
      />
    </>
  );
};
