import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityPensionLoss: BookingStepComponent = ({
  errors,
  step,
}) => {
  const { tList } = useTranslation();
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.eligibilityPensionLossStatus}`;
  const sections = tList(`${contentKey}.sections`);

  return (
    <>
      <SectionsRenderer sections={sections} testIdPrefix={step} />
      <OptionTypes
        step={step}
        name={FormFieldName.ELIGIBILITY_PENSION_LOSS_STATUS}
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </>
  );
};
