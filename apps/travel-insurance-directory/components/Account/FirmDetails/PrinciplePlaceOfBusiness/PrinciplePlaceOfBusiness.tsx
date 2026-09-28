import { useMemo } from 'react';

import { TextInputGroup } from 'components/form/TextInputGroup';
import {
  addressLineOneField,
  addressLineTwoField,
  countryField,
  postcodeField,
  principlePlaceOfBusinessPage,
  townField,
} from 'data/pages/account/firm-details/principle-place-of-business';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { generateTextInputGroupProps } from 'utils/formHelpers/generateTextInputGroupProps';

import { FirmDetailsFormTemplate } from '../FirmDetailsFormTemplate/FirmDetailsFormTemplate';

type Props = {
  initialValues: TravelInsuranceFirmDocument | null;
  firmId: string;
  isChangeAnswer?: string;
};

const pageInputs = [
  addressLineOneField,
  addressLineTwoField,
  townField,
  countryField,
  postcodeField,
];

export const PrinciplePlaceOfBusiness = ({
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
      pageConfig={principlePlaceOfBusinessPage}
    >
      <TextInputGroup inputs={inputGroupProps} />
    </FirmDetailsFormTemplate>
  );
};
