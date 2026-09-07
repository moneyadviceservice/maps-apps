import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes, SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';
import { findEncodedOptionValue } from '../../../lib/utils';

/**
 * AccessSupport component renders the Access Support step of the booking form.
 * It displays sections and a question radio button for the user to select their access support status.
 */
export const AccessSupport: BookingStepComponent = ({ entry, errors }) => {
  const { tList } = useTranslation();
  const componentKey = `components.${StepName.ACCESS_SUPPORT}`;
  const sections = tList(`${componentKey}.sections`);
  const formContentKey = `${componentKey}.form.radio-button`;
  const options = tList(`${formContentKey}.options`);

  return (
    <>
      <SectionsRenderer
        sections={sections}
        testIdPrefix={StepName.ACCESS_SUPPORT}
      />
      <OptionTypes
        step={StepName.ACCESS_SUPPORT}
        name={'accessSupportStatus'}
        errors={errors}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
        defaultChecked={findEncodedOptionValue(
          options,
          entry?.data?.accessSupportStatus as string | undefined,
        )}
      />
    </>
  );
};
