import { useMemo } from 'react';

import { TextInputGroup } from 'components/form/TextInputGroup';
import {
  customerContactDetailsPage,
  emailField,
  telephoneNumberField,
  websiteAddressField,
} from 'data/pages/account/firm-details/customer-contact-details';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { generateTextInputGroupProps } from 'utils/formHelpers/generateTextInputGroupProps';

import { FirmDetailsFormTemplate } from '../FirmDetailsFormTemplate/FirmDetailsFormTemplate';

type Props = {
  initialValues: TravelInsuranceFirmDocument | null;
  firmId: string;
  isChangeAnswer?: string;
};

const pageInputs = [websiteAddressField, telephoneNumberField, emailField];

export const CustomerContactDetails = ({
  initialValues,
  firmId,
  isChangeAnswer,
}: Props) => {
  const inputGroupProps = useMemo(() => {
    return generateTextInputGroupProps(pageInputs, initialValues);
  }, [initialValues]);

  return (
    <FirmDetailsFormTemplate
      firmId={firmId}
      isChangeAnswer={isChangeAnswer}
      pageConfig={customerContactDetailsPage}
    >
      <TextInputGroup inputs={inputGroupProps} />
    </FirmDetailsFormTemplate>
  );
};
