import type { pensionPotsCopy } from 'data/pensions';
import { twMerge } from 'tailwind-merge';
import type { Contribution as ContributionType } from 'types/pensions';
import { contributionFieldId } from 'utils/pensionFieldIds';

import { Details } from '@maps-react/common/components/Details';
import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { AffixInput } from '@maps-react/form/components/AffixInput';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';

type ContributionProps = {
  kind: 'employee' | 'employer';
  label: string;
  hint?: string;
  contribution: ContributionType;
  potIndex?: number;
  error?: string;
  copy: ReturnType<typeof pensionPotsCopy>;
  onChange: (updatedContribution: ContributionType) => void;
  className?: string;
};

export const Contribution = ({
  kind,
  label,
  hint,
  contribution,
  potIndex,
  error,
  copy,
  onChange,
  className,
}: ContributionProps) => {
  const percentageValueId = contributionFieldId(
    kind,
    'percentageValue',
    potIndex,
  );
  const fixedValueId = contributionFieldId(kind, 'fixedValue', potIndex);
  const modeId = contributionFieldId(kind, 'mode', potIndex);

  const percentageInput = (
    <AffixInput
      id={percentageValueId}
      name={percentageValueId}
      label={copy.percentageInputLabel}
      value={contribution.mode === 'percentage' ? contribution.value : ''}
      onChange={(event) =>
        onChange({
          ...contribution,
          value: event.target.value,
        })
      }
      variant={'percent'}
      className="border-gray-650 max-h-10"
      inputFlexClassName="block max-w-lg"
      containerClassName="mt-4"
      labelClassName="text-base"
    />
  );

  const moneyInput = (
    <AffixInput
      id={fixedValueId}
      name={fixedValueId}
      label={copy.fixedInputLabel}
      value={contribution.mode === 'fixed' ? contribution.value : ''}
      onChange={(event) =>
        onChange({
          ...contribution,
          value: event.target.value,
        })
      }
      variant={'money'}
      className="max-w-lg border-gray-650 max-h-10"
      inputFlexClassName="block"
      containerClassName="mt-4"
      labelClassName="text-base"
    />
  );

  return (
    <Errors
      errors={error ? [error] : []}
      className={twMerge('pb-2', className)}
    >
      <fieldset className="space-y-3 max-w-xl">
        <QuestionRadioButton
          hint={hint}
          key={modeId}
          testId={modeId}
          name={modeId}
          options={[
            { text: copy.fixed, value: 'fixed', children: moneyInput },
            {
              text: copy.percentage,
              value: 'percentage',
              children: percentageInput,
            },
          ]}
          defaultChecked={contribution.mode}
          onChange={(event) => {
            const selectedMode = event.target.value as ContributionType['mode'];
            onChange({
              ...contribution,
              mode: selectedMode,
              value:
                selectedMode === contribution.mode ? contribution.value : '',
            });
          }}
          error={error}
        >
          {label}
        </QuestionRadioButton>

        <Details title={copy.contributionHintLabel}>
          <Paragraph className="max-w-lg">{copy.contributionHint}</Paragraph>
        </Details>
      </fieldset>
    </Errors>
  );
};
