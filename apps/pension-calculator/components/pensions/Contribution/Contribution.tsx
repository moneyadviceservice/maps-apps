import type { Dispatch, SetStateAction } from 'react';

import { pensionsCopy } from 'data/pensions';
import type { PotsOfMoneyData } from 'types/pensions';
import { contributionFieldId } from 'utils/pensionFieldIds';

import { Errors } from '@maps-react/common/components/Errors';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import type { Options } from '@maps-react/form/components/Select';
import { Select } from '@maps-react/form/components/Select';

type ContributionProps = {
  kind: 'employee' | 'employer';
  label: string;
  data: PotsOfMoneyData;
  error?: string;
  copy: ReturnType<typeof pensionsCopy>;
  options: Options[];
  setData: Dispatch<SetStateAction<PotsOfMoneyData>>;
};

export const Contribution = ({
  kind,
  label,
  data,
  error,
  copy,
  options,
  setData,
}: ContributionProps) => {
  const contribution = data[`${kind}Contribution`];
  const valueId = contributionFieldId(kind, 'value');
  return (
    <Errors errors={error ? [error] : []}>
      <fieldset className="space-y-3">
        <legend className="text-xl">{label}</legend>
        <QuestionRadioButton
          key={`${kind}-${contribution.mode}`}
          name={contributionFieldId(kind, 'mode')}
          options={[
            { text: copy.percentage, value: 'percentage' },
            { text: copy.fixed, value: 'fixed' },
          ]}
          defaultChecked={contribution.mode}
          horizontalLayout
          onChange={(event) =>
            setData((current) => ({
              ...current,
              [`${kind}Contribution`]: {
                ...current[`${kind}Contribution`],
                mode: event.target.value as 'percentage' | 'fixed',
              },
            }))
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
              className="w-full max-w-[200px] border rounded p-2"
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  [`${kind}Contribution`]: {
                    ...current[`${kind}Contribution`],
                    value: event.target.value,
                  },
                }))
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
                setData((current) => ({
                  ...current,
                  [`${kind}Contribution`]: {
                    ...current[`${kind}Contribution`],
                    value: event.target.value,
                  },
                }))
              }
            />
            <Select
              id={contributionFieldId(kind, 'frequency')}
              name={contributionFieldId(kind, 'frequency')}
              label={copy.frequency}
              hideLabel
              hideEmptyItem
              options={options}
              value={contribution.frequency}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  [`${kind}Contribution`]: {
                    ...current[`${kind}Contribution`],
                    frequency: event.target.value,
                  },
                }))
              }
            />
          </div>
        )}
      </fieldset>
    </Errors>
  );
};
