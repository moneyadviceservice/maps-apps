import { twMerge } from 'tailwind-merge';

import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { Options, Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';

type InputProps = {
  moneyInputname: string;
  moneyInputLabelText?: string;
  moneyInputValue: string;
  onMoneyInputChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type FrequencyDropDownProps = {
  frequencySelectName: string;
  frequencySelectLabelText?: string;
  frequencySelectOptions: Options[];
  frequencySelectDefaultValue?: string;
  frequencySelectValue: string;
  onfrequencySelectChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

export type MoneyFrequencyLabelInput = {
  labelInputName?: string;
  labelInputLabelText?: string;
  labelInputValue?: string;
  labelPlaceholder?: string;
  onLabelInputChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type Props = {
  /** The `<legend>` for the group. Screen readers announce this before each item. Use `hideLabel` to visually hide it. */
  labelText?: string;
  hideLabel?: boolean;
  testId?: string;
  onValueUpdate?: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement>;
  ariaLabelSuffix?: string;
};

export type MoneyInputFrequencyGroupProps = InputProps &
  FrequencyDropDownProps &
  MoneyFrequencyLabelInput &
  Props;

const MoneyInputFrequencyGroup = ({
  moneyInputname,
  moneyInputLabelText,
  moneyInputValue,
  onMoneyInputChange,
  frequencySelectName,
  frequencySelectLabelText,
  frequencySelectOptions,
  frequencySelectDefaultValue,
  frequencySelectValue,
  onfrequencySelectChange,
  labelInputName,
  labelInputLabelText,
  labelInputValue,
  labelPlaceholder,
  onLabelInputChange,
  labelText,
  hideLabel,
  testId,
  onValueUpdate,
  ariaLabelSuffix,
}: MoneyInputFrequencyGroupProps) => {
  const moneyInputLabelTextWithSuffix = [
    moneyInputLabelText ?? labelText,
    ariaLabelSuffix,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <fieldset className="flex flex-col gap-2">
      {labelText && (
        <legend
          className={twMerge(
            'mb-2 text-base font-bold',
            hideLabel && 'sr-only',
          )}
        >
          {labelText}
        </legend>
      )}

      {labelInputName && (
        <TextInput
          id={labelInputName}
          name={labelInputName}
          aria-label={labelInputLabelText ?? labelText}
          value={labelInputValue}
          onChange={onLabelInputChange}
          className="w-full"
          placeholder={labelPlaceholder}
          data-testid={labelInputName}
          onBlur={onValueUpdate}
        />
      )}

      <div className="flex gap-6">
        <MoneyInput
          id={moneyInputname}
          name={moneyInputname}
          aria-label={moneyInputLabelTextWithSuffix}
          value={moneyInputValue}
          onChange={onMoneyInputChange}
          data-testid={testId}
          onBlur={onValueUpdate}
          containerClassName="basis-1/2"
        />
        <Select
          id={frequencySelectName}
          name={frequencySelectName}
          aria-label={frequencySelectLabelText ?? labelText}
          options={frequencySelectOptions}
          defaultValue={frequencySelectDefaultValue}
          onChange={onfrequencySelectChange}
          value={frequencySelectValue}
          hideEmptyItem={true}
          selectClassName="h-full"
          data-testid={frequencySelectName}
          onBlur={onValueUpdate}
          className="mt-0 basis-1/2"
        />
      </div>
    </fieldset>
  );
};

export default MoneyInputFrequencyGroup;
