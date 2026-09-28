import { getValueByPath } from 'lib/firms/getValueByPath';
import { InputField } from 'types/register';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export const generateTextInputGroupProps = (
  pageInputs: InputField[],
  initialValues: TravelInsuranceFirmDocument | null,
) =>
  pageInputs.map((input) => ({
    key: input.key,
    title: input.title,
    type: input.type,
    defaultValue: initialValues
      ? getValueByPath(initialValues, `${input.dataPath}/${input.key}`)
      : '',
  }));
