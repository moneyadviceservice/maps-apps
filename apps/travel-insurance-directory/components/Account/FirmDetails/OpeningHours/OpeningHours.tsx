import { FirmDetailsFormTemplate } from 'components/Account/FirmDetails/FirmDetailsFormTemplate';
import { ConditionalTimeInput } from 'components/form/ConditionalTimeInput';
import { TimeInput } from 'components/form/TimeInput';
import {
  closingTimeField,
  openingHoursPage,
  openingTimeField,
  saturdayClosingField,
  saturdayOpeningField,
  saturdayOpeningRadioField,
  sundayClosingField,
  sundayOpeningField,
  sundayOpeningRadioField,
} from 'data/pages/account/firm-details/opening-hours';
import { getValueByPath } from 'lib/firms/getValueByPath';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

type Props = {
  initialValues: TravelInsuranceFirmDocument | null;
  firmId: string;
  isChangeAnswer?: string;
};

const openClosingInputs = [openingTimeField, closingTimeField];

export const OpeningHours = ({
  initialValues,
  firmId,
  isChangeAnswer,
}: Props) => {
  return (
    <FirmDetailsFormTemplate
      firmId={firmId}
      isChangeAnswer={isChangeAnswer}
      pageConfig={openingHoursPage}
    >
      <span className="font-bold">{openingTimeField.heading}</span>
      {openClosingInputs.map((input) => (
        <TimeInput
          key={input.key}
          inputField={input}
          initialValue={
            initialValues
              ? getValueByPath(initialValues, `${input.dataPath}/${input.key}`)
              : ''
          }
        />
      ))}

      <ConditionalTimeInput
        radioField={saturdayOpeningRadioField}
        openClosingInputs={[saturdayOpeningField, saturdayClosingField]}
        firmData={initialValues}
      />
      <ConditionalTimeInput
        radioField={sundayOpeningRadioField}
        openClosingInputs={[sundayOpeningField, sundayClosingField]}
        firmData={initialValues}
      />
    </FirmDetailsFormTemplate>
  );
};
