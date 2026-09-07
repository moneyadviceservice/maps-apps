import { Link } from '@maps-react/common/components/Link/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';

import { StepName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const AddressConfirmation: BookingStepComponent = ({ step, entry }) => {
  if (!entry) {
    throw new TypeError('[AddressConfirmation] Missing entry');
  }

  const { t } = useTranslation();
  const componentKey = `components.${StepName.ADDRESS_CONFIRMATION}`;

  const {
    locale,
    addressLine1,
    addressLine2,
    city,
    county,
    postcode,
    country,
  } = entry.data;

  return (
    <div className="pt-6 md:pt-8 md:w-fit">
      <div className="flex flex-col gap-8">
        <address className="not-italic">
          <div>{addressLine1}</div>
          <div>{addressLine2}</div>
          <div>{city}</div>
          <div>{county}</div>
          <div>{postcode}</div>
          <div>{country}</div>
        </address>
        <Link
          href={`/${locale}/${StepName.ADDRESS_DETAILS}`}
          className="md:w-fit"
        >
          {t(`${componentKey}.link`)}
        </Link>
      </div>
      <FormWrapper step={step} nextStep={StepName.CONFIRM_DETAILS} />
    </div>
  );
};
