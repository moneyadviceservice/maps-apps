import type { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { Select } from '@maps-react/form/components/Select';
import useTranslation from '@maps-react/hooks/useTranslation';

export type PensionContributionFieldProps = {
  valueId: string;
  typeId: string;
  valueTestId: string;
  typeTestId: string;
  label: { en: string; cy: string };
  hint: { en: string; cy: string };
  ariaLabelSuffix?: string;
  defaultValue?: string;
  defaultType?: PensionContributionType;
  errors?: string[];
};

/**
 * One amount input with a "% of your salary" / "amount in £" select beside it.
 * Both controls are uncontrolled so the form submits without JavaScript.
 */
export const PensionContributionField = ({
  valueId,
  typeId,
  valueTestId,
  typeTestId,
  label,
  hint,
  ariaLabelSuffix,
  defaultValue = '',
  defaultType = 'percentage',
  errors = [],
}: PensionContributionFieldProps) => {
  const { z } = useTranslation();

  const labelId = `${valueId}-label`;
  const hintId = `${valueId}-hint`;
  const errorId = `${valueId}Error`;

  const describedBy = [hintId, errors.length > 0 ? errorId : undefined]
    .filter(Boolean)
    .join(' ');

  const typeOptions = [
    {
      text: z({ en: '% of your salary', cy: "% o'ch cyflog" }),
      value: 'percentage',
    },
    {
      text: z({ en: 'amount in £', cy: 'swm mewn £' }),
      value: 'fixed',
    },
  ];

  return (
    <div className="mt-4">
      <label
        id={labelId}
        htmlFor={valueId}
        className="block text-[24px] text-gray-800 mb-2"
      >
        {z(label)}
        {ariaLabelSuffix && <span className="sr-only"> {ariaLabelSuffix}</span>}
      </label>

      <Paragraph id={hintId} className="text-base text-gray-650 mb-4">
        {z(hint)}
      </Paragraph>

      <Errors errors={errors}>
        {errors.map((msg) => (
          <div key={msg} id={errorId}>
            <span className="sr-only">Error:</span>
            <div className="block mb-2 text-red-600">{msg}</div>
          </div>
        ))}

        <div className="flex flex-col gap-4 sm:flex-row">
          <NumberInput
            id={valueId}
            name={valueId}
            defaultValue={defaultValue}
            decimalScale={2}
            inputMode="decimal"
            dataTestId={valueTestId}
            className="border-gray-400 p-[8px] border rounded focus:border-blue-700 h-12 sm:basis-1/2"
            aria-describedby={describedBy}
          />

          <Select
            id={typeId}
            name={typeId}
            options={typeOptions}
            defaultValue={defaultType}
            hideEmptyItem
            aria-labelledby={labelId}
            className="mt-0 sm:basis-1/2"
            selectClassName="h-12 text-gray-800"
            data-testid={typeTestId}
          />
        </div>
      </Errors>
    </div>
  );
};
