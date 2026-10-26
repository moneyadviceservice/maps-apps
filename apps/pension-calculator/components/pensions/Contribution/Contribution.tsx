import type { pensionPotsCopy } from 'data/pensions';
import type { Contribution as ContributionType } from 'types/pensions';
import { contributionFieldId } from 'utils/pensionFieldIds';

import { Errors } from '@maps-react/common/components/Errors';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import type { Options } from '@maps-react/form/components/Select';
import { Select } from '@maps-react/form/components/Select';

type ContributionProps = {
  kind: 'employee' | 'employer';
  label: string;
  contribution: ContributionType;
  potIndex?: number;
  error?: string;
  copy: ReturnType<typeof pensionPotsCopy>;
  options: Options[];
  onChange: (updatedContribution: ContributionType) => void;
};

export const Contribution = ({
  kind,
  label,
  contribution,
  potIndex,
  error,
  copy,
  options,
  onChange,
}: ContributionProps) => {
  const valueId = contributionFieldId(kind, 'value', potIndex);
  const modeId = contributionFieldId(kind, 'mode', potIndex);
  const frequencyId = contributionFieldId(kind, 'frequency', potIndex);

  return (
    <Errors errors={error ? [error] : []}>
      <fieldset className="space-y-3">
        <legend className="text-xl">{label}</legend>
        <QuestionRadioButton
          key={`${kind}-${contribution.mode}`}
          name={modeId}
          options={[
            { text: copy.percentage, value: 'percentage' },
            { text: copy.fixed, value: 'fixed' },
          ]}
          defaultChecked={contribution.mode}
          horizontalLayout
          onChange={(event) =>
            onChange({
              ...contribution,
              mode: event.target.value as 'percentage' | 'fixed',
            })
          }
        />
        {error && <p className="text-red-700">{error}</p>}
        {contribution.mode === 'percentage' ? (
          <>
            <label htmlFor={valueId} className="sr-only">
              {copy.percentage}
            </label>
            <input
              id={valueId}
              name={valueId}
              value={contribution.value}
              inputMode="decimal"
              className="w-full max-w-[200px] rounded border p-2"
              onChange={(event) =>
                onChange({
                  ...contribution,
                  value: event.target.value,
                })
              }
            />
            <p>{copy.percentageHint}</p>
          </>
        ) : (
          <div className="flex max-w-[412px] gap-2">
            <MoneyInput
              id={valueId}
              name={valueId}
              value={contribution.value}
              onChange={(event) =>
                onChange({
                  ...contribution,
                  value: event.target.value,
                })
              }
            />
            <Select
              id={frequencyId}
              name={frequencyId}
              label={copy.frequency}
              hideLabel
              hideEmptyItem
              options={options}
              value={contribution.frequency}
              onChange={(event) =>
                onChange({
                  ...contribution,
                  frequency: event.target
                    .value as ContributionType['frequency'],
                })
              }
            />
          </div>
        )}
      </fieldset>
    </Errors>
  );
};
