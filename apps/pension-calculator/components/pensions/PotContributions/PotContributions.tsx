import { PensionPotsCopy } from 'data/pensions';
import { DefinedContributionPot } from 'types/pensions/pensions';
import { contributionFieldId } from 'utils/pensionFieldIds';

import { Contribution } from '../Contribution';

interface PotContributionsProps {
  index: number;
  pot: DefinedContributionPot;
  errors: Record<string, string[]>;
  updatePot: <K extends keyof DefinedContributionPot>(
    index: number,
    field: K,
    value: DefinedContributionPot[K],
  ) => void;
  copy: PensionPotsCopy;
}

export const PotContributions = ({
  index,
  pot,
  errors,
  updatePot,
  copy,
}: PotContributionsProps) => {
  return (
    <div className="space-y-4 pt-4">
      <Contribution
        kind="employee"
        label={copy.employeeContribution}
        hint={copy.employeeContributionHint}
        contribution={pot.employeeContribution}
        potIndex={index}
        error={errors[contributionFieldId('employee', 'value', index)]?.[0]}
        copy={copy}
        onChange={(updatedContribution) =>
          updatePot(index, 'employeeContribution', updatedContribution)
        }
        className="border-b border-gray-300 pb-6"
      />
      <Contribution
        kind="employer"
        label={copy.employerContribution}
        contribution={pot.employerContribution}
        potIndex={index}
        error={errors[contributionFieldId('employer', 'value', index)]?.[0]}
        copy={copy}
        onChange={(updatedContribution) =>
          updatePot(index, 'employerContribution', updatedContribution)
        }
      />
    </div>
  );
};
