import {
  AmountFrequencyField,
  INCOME_FIELD_GROUP_CLASS,
} from 'components/your-income/AmountFrequencyField';
import type { OtherIncomeRow } from 'types/income';
import {
  otherIncomeAmountId,
  otherIncomeFrequencyId,
  otherIncomeNameId,
  otherIncomeRemoveId,
} from 'utils/incomeFieldIds';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import type { Options } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';

type Props = {
  index: number;
  row: OtherIncomeRow;
  heading: string;
  nameLabel: string;
  namePlaceholder: string;
  amountLabel: string;
  frequencyLabel: string;
  frequencyOptions: Options[];
  removeLabel: string;
  showRemove: boolean;
  nameError?: string;
  amountError?: string;
  removeFormAction: string;
  onNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const OtherIncomeRowFields = ({
  index,
  row,
  heading,
  nameLabel,
  namePlaceholder,
  amountLabel,
  frequencyLabel,
  frequencyOptions,
  removeLabel,
  showRemove,
  nameError,
  amountError,
  removeFormAction,
  onNameChange,
  onAmountChange,
  onFrequencyChange,
  onRemove,
}: Props) => {
  const nameId = otherIncomeNameId(index);
  const amountId = otherIncomeAmountId(index);
  const frequencyId = otherIncomeFrequencyId(index);
  const nameErrorId = `${nameId}-error`;

  return (
    <div className="space-y-4 pb-6 mb-6 border-b border-gray-300">
      <Heading
        level="h3"
        className="text-4xl font-semibold text-gray-800 md:text-4xl"
      >
        {heading}
      </Heading>
      <Errors errors={nameError ? [nameError] : []}>
        <label
          htmlFor={nameId}
          className="mb-2 block text-2xl font-medium text-gray-800"
        >
          {nameLabel}
        </label>
        {nameError && (
          <p id={nameErrorId} className="mb-1 text-red-700">
            {nameError}
          </p>
        )}
        <TextInput
          id={nameId}
          name={nameId}
          value={row.name}
          placeholder={namePlaceholder}
          onChange={(event) => onNameChange(event.target.value)}
          aria-invalid={!!nameError}
          aria-describedby={nameError ? nameErrorId : undefined}
          containerClassName={INCOME_FIELD_GROUP_CLASS}
          className="m-0 mt-0 w-full"
        />
      </Errors>
      <Errors errors={amountError ? [amountError] : []}>
        <AmountFrequencyField
          amountId={amountId}
          amountName={amountId}
          amountValue={row.amount}
          amountLabel={amountLabel}
          frequencyId={frequencyId}
          frequencyName={frequencyId}
          frequencyValue={row.frequency}
          frequencyLabel={frequencyLabel}
          frequencyOptions={frequencyOptions}
          legend={amountLabel}
          legendClassName="mb-2 text-2xl font-medium text-gray-800"
          error={amountError}
          hasError={!!amountError}
          onAmountChange={onAmountChange}
          onFrequencyChange={onFrequencyChange}
        />
      </Errors>
      {showRemove && (
        <Button
          variant="link"
          id={otherIncomeRemoveId(index)}
          formAction={removeFormAction}
          onClick={onRemove}
          className="px-0"
        >
          {removeLabel}
        </Button>
      )}
    </div>
  );
};
