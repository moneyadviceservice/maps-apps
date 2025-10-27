import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { Options, Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';

type InputProps = {
  moneyInputname: string;
  moneyInputValue: string;
  onMoneyInputChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type FrequencyDropDownProps = {
  frequencySelectName: string;
  frequencySelectOptions: Options[];
  frequencySelectDefaultValue?: string;
  frequencySelectValue: string;
  onfrequencySelectChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

export type MoneyFrequencyLabelInput = {
  labelInputName?: string;
  labelInputValue?: string;
  onLabelInputChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export type MoneyInputFrequencyGroupProps = InputProps &
  FrequencyDropDownProps &
  MoneyFrequencyLabelInput & { labelText?: string; testId?: string };

const MoneyInputFrequencyGroup = ({
  moneyInputname,
  moneyInputValue,
  onMoneyInputChange,
  frequencySelectName,
  frequencySelectOptions,
  frequencySelectDefaultValue,
  frequencySelectValue,
  onfrequencySelectChange,
  labelInputName,
  labelInputValue,
  onLabelInputChange,
  labelText,
  testId,
}: MoneyInputFrequencyGroupProps) => {
  return (
    <div className="flex flex-col space-y-2">
      {labelText && (
        <label className="text-base font-bold" htmlFor={moneyInputname}>
          {labelText}
        </label>
      )}

      {labelInputName && (
        <TextInput
          name={labelInputName}
          value={labelInputValue}
          onChange={onLabelInputChange}
          className="w-full mb-4"
          id={labelInputName}
          data-testid={labelInputName}
        />
      )}

      <div className="flex gap-6">
        <MoneyInput
          name={moneyInputname}
          value={moneyInputValue}
          onChange={onMoneyInputChange}
          data-testid={testId}
        />
        <Select
          name={frequencySelectName}
          options={frequencySelectOptions}
          defaultValue={frequencySelectDefaultValue}
          onChange={onfrequencySelectChange}
          value={frequencySelectValue}
          hideEmptyItem={true}
          selectClassName="h-full"
          data-testid={frequencySelectName}
        />
      </div>
    </div>
  );
};

export default MoneyInputFrequencyGroup;
