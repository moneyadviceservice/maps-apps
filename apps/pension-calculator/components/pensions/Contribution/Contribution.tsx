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
  const valueId = contributionFieldId(kind, 'value', potIndex);
  const modeId = contributionFieldId(kind, 'mode', potIndex);

  const percentageInput = (
    <AffixInput
      id={valueId}
      name={valueId}
      label={copy.percentageInputLabel}
      value={contribution.value}
      variant={'percent'}
      className="border-gray-650"
      inputFlexClassName="block max-w-lg"
      containerClassName="mt-4"
      labelClassName="text-base"
    />
  );

  const moneyInput = (
    <AffixInput
      id={valueId}
      name={valueId}
      label={copy.fixedInputLabel}
      value={contribution.value}
      onChange={(event) =>
        onChange({
          ...contribution,
          value: event.target.value,
        })
      }
      variant={'money'}
      className="max-w-lg border-gray-650"
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
          key={`${kind}-${contribution.mode}`}
          name={modeId}
          options={[
            {
              text: copy.percentage,
              value: 'percentage',
              children: percentageInput,
            },
            { text: copy.fixed, value: 'fixed', children: moneyInput },
          ]}
          defaultChecked={contribution.mode}
          onChange={(event) =>
            onChange({
              ...contribution,
              mode: event.target.value as 'percentage' | 'fixed',
            })
          }
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
