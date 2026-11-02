import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';
import { findEncodedOptionValue } from '@maps-react/mhf/utils';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

/**
 * AccessSupport component renders the Access Support step of the booking form.
 * It displays sections and a question radio button for the user to select their access support status.
 */
export const AccessSupport: BookingStepComponent = ({
  entry,
  errors,
  step,
}) => {
  const { tList } = useTranslation();
  const contentKey = `components.${step}`;
  const sections = tList(`${contentKey}.sections`);
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportStatus}`;
  const options = tList(`${formContentKey}.options`);

  return (
    <>
      <SectionsRenderer sections={sections} testIdPrefix={step} />
      <OptionTypes
        step={step}
        name={FormFieldName.ACCESS_SUPPORT_STATUS}
        errors={errors}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
        defaultChecked={findEncodedOptionValue(
          options,
          entry?.data?.[FormFieldName.ACCESS_SUPPORT_STATUS] as
            | string
            | undefined,
        )}
      />
    </>
  );
};
