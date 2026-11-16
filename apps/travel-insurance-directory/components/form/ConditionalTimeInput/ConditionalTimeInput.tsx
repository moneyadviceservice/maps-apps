import { getValueByPath } from 'lib/firms/getValueByPath';
import { InputField } from 'types/register';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { FieldError } from '../FieldError';
import { RadioInput, RadioQuestion } from '../RadioQuestion';
import { TimeInput } from '../TimeInput';

type RadioValue = 'yes' | 'no' | undefined;

const getInitialValueOnLoad = (
  firmData: TravelInsuranceFirmDocument | null,
  radioField: InputField,
  openClosingInputs: InputField[],
): RadioValue => {
  if (!firmData) return undefined;

  const radioValue = getValueByPath(
    firmData,
    `${radioField.dataPath}/${radioField.key}`,
  );

  if (radioValue === 'yes' || radioValue === 'no') {
    return radioValue;
  }

  const hasTimes = openClosingInputs.some((input) =>
    Boolean(getValueByPath(firmData, `${input.dataPath}/${input.key}`)),
  );

  return hasTimes ? 'yes' : undefined;
};

type Props = {
  radioField: InputField & RadioInput;
  openClosingInputs: InputField[];
  firmData: TravelInsuranceFirmDocument | null;
};

export const ConditionalTimeInput = ({
  radioField,
  openClosingInputs,
  firmData,
}: Props) => {
  const initialValueOnLoad = getInitialValueOnLoad(
    firmData,
    radioField,
    openClosingInputs,
  );

  return (
    <div className="mt-16 group/conditional">
      <FieldError fieldKey={radioField.key}>
        <RadioQuestion
          radioInput={radioField}
          initialValue={initialValueOnLoad}
          legendClassName={'mb-4'}
        />
      </FieldError>

      <div
        className="hidden group-has-[input[value='yes']:checked]/conditional:block"
        data-testid="time-inputs-wrapper"
      >
        {openClosingInputs.map((input) => (
          <TimeInput
            key={input.key}
            inputField={input}
            initialValue={
              firmData
                ? getValueByPath(firmData, `${input.dataPath}/${input.key}`)
                : ''
            }
          />
        ))}
      </div>
    </div>
  );
};
